import { Injectable } from '@nestjs/common';
import { encryptPassword, makeSalt } from '@/utils/cryptogram.utils';
import { GetUserInfoDto, UserRegisterDto } from './dto/user.dto';
import { users, chatRoom, contactGroup } from '@/database/models';
import { InjectModel } from '@nestjs/sequelize';
import { EmailService } from '@/modules/email/email.service';
import { formatJsonNull } from '@/utils/formatJson.utils';
// import { col, fn, Op, Sequelize } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(users) private userModel: typeof users,
    @InjectModel(chatRoom) private chatRoomModel: typeof chatRoom,
    @InjectModel(contactGroup) private contactGroupModel: typeof contactGroup,
    private readonly emailService: EmailService,
  ) {}

  // 编辑和user模块相关的业务逻辑
  async getUserList() {
    const userList = await this.userModel.findAll({
      attributes: [
        ['user_id', 'userId'],
        ['account_name', 'username'],
        ['real_name', 'realName'],
        'mobile',
        'role',
      ],
      raw: true,
      logging: true,
    });
    return {
      code: 0,
      msg: 'ok',
      data: userList,
    };
  }

  // 获取登录用户信息
  async getUserSelfInfo({ uid, username, usreId }: GetUserInfoDto) {
    // 处理查询参数 优先级 uid > username > user_id
    const where = {};
    if (uid) {
      where['uid'] = uid;
    } else if (username) {
      where['accountName'] = username;
    } else if (usreId) {
      where['usreId'] = usreId;
    }
    try {
      const userInfo = await this.userModel.findOne({
        attributes: {
          exclude: ['password', 'passwordSalt', 'deletedAt'],
          // include: [
          //   [
          //     fn('date_format', col('updated_at'), '%Y-%m-%d %H:%i:%s'),
          //     'updatedAt',
          //   ],
          //   [
          //     fn('date_format', col('created_at'), '%Y-%m-%d %H:%i:%s'),
          //     'createdAt',
          //   ],
          // ],
        },
        where,
        logging: true,
      });

      return {
        code: 0,
        msg: 'Success',
        data: userInfo,
      };
    } catch (error) {
      return {
        code: 503,
        msg: `Service error: ${error}`,
      };
    }
  }

  // 获取单个用户信息（token 验证）
  async findOne(username: string): Promise<any | undefined> {
    try {
      const user = await this.userModel.findOne({
        where: {
          accountName: username,
        },
        raw: true,
        logging: true,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // 用户注册
  async register(reqBody: UserRegisterDto): Promise<any> {
    const {
      accountName,
      password,
      repassword,
      email,
      birthday,
      gender,
      emailCode,
    } = reqBody;
    if (password !== repassword) {
      return {
        code: 1,
        msg: '两次密码输入不一致',
        data: null,
      };
    }
    try {
      const user = await this.findOne(accountName);
      if (user) {
        return {
          code: 2,
          msg: '该用户名已经被注册',
          data: null,
        };
      }

      if (await this.checkoutRegisterEmail(email)) {
        return {
          code: 3,
          msg: '账号邮箱已被注册',
          data: null,
        };
      }

      // 验证邮箱验证码
      const verifyRes = await this.emailService.verifyEmailCode({
        email,
        emailCode,
      });

      if (verifyRes.code !== 0) {
        return {
          code: 4,
          msg: verifyRes.msg,
          data: null,
        };
      }

      const salt = makeSalt(); // 制作密码盐
      const hashPwd = encryptPassword(password, salt); // 加密密码

      const userRecord = await this.userModel.create(
        {
          accountName: accountName,
          password: hashPwd,
          passwordSalt: salt,
          email,
          birthday,
          gender,
          nickName: accountName,
        },
        {
          logging: true,
        },
      );

      // 新用户初始化分组
      await this.contactGroupModel.create(
        {
          uid: userRecord.uid,
          type: 0,
          groupName: '我的好友',
          groupOrder: -1,
        },
        {
          logging: true,
        },
      );

      return {
        code: 0,
        msg: 'success',
      };
    } catch (error) {
      return {
        code: 503,
        msg: `service error: ${error}`,
      };
    }
  }

  // 校验用户邮箱是否已注册
  async checkoutRegisterEmail(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      where: {
        email,
      },
      // raw: true,
      // logging: true,
    });

    return !!user;
  }

  // 测试
  async test() {
    const res = await this.chatRoomModel.create({
      chatName: 'private-01',
    });

    await this.chatRoomModel.destroy({
      where: {
        chatName: 'private-01',
      },
    });

    return {
      code: 0,
      msg: 'success',
      data: res,
    };
  }
}
