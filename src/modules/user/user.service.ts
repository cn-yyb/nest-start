import { Injectable } from '@nestjs/common';
import { encryptPassword, makeSalt } from '@/utils/cryptogram.utils';
import { UserRegisterDto } from './dto/user.dto';
import { users, chatRoom } from '@/database/models';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(users) private userModel: typeof users,
    @InjectModel(chatRoom) private chatRoomModel: typeof chatRoom,
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
  async getUserSelfInfo(username: string) {
    try {
      const userInfo = await this.userModel.findOne({
        attributes: [
          ['user_id', 'userId'],
          ['account_name', 'username'],
          ['real_name', 'realName'],
          'mobile',
          'role',
        ],
        where: {
          accountName: username,
        },
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

  async register(reqBody: UserRegisterDto): Promise<any> {
    const { accountName, password, repassword, email, birthday, gender } =
      reqBody;
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
          code: 1,
          msg: '该用户名已经被注册',
          data: null,
        };
      }

      if (await this.checkoutRegisterEmail(email)) {
        return {
          code: 1,
          msg: '账号邮箱已被注册',
        };
      }

      const salt = makeSalt(); // 制作密码盐
      const hashPwd = encryptPassword(password, salt); // 加密密码

      await this.userModel.create(
        {
          accountName: accountName,
          password: hashPwd,
          passwordSalt: salt,
          email: email,
          birthday,
          gender,
        },
        {
          logging: true,
        },
      );
      return {
        code: 0,
        msg: 'Success',
      };
    } catch (error) {
      return {
        code: 503,
        msg: `Service error: ${error}`,
      };
    }
  }

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
