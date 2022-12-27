import { Injectable } from '@nestjs/common';
import { UserInfoItem } from './interfaces/user.interface';
// import * as Sequelize from 'sequelize'; // 引入 Sequelize 库
// import sequelize from '@/database/sequelize'; // 引入 Sequelize 实例
import { encryptPassword, makeSalt } from '@/utils/cryptogram.utils';
import { RegisterUserDto } from './dto/user.dto';
import { adminUser } from '@/database/models';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
  constructor(@InjectModel(adminUser) private userModel: typeof adminUser) {}

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
      return {
        code: 503,
        msg: `Service error: ${error}`,
      };
    }
  }

  async register(reqBody: RegisterUserDto): Promise<any> {
    const { accountName, realName, password, repassword, mobile } = reqBody;
    if (password !== repassword) {
      return {
        code: 400,
        msg: '两次密码输入不一致',
        data: null,
      };
    }
    const user = await this.findOne(accountName);
    if (user) {
      return {
        code: 400,
        msg: '用户已存在',
        data: null,
      };
    }

    const salt = makeSalt(); // 制作密码盐
    const hashPwd = encryptPassword(password, salt); // 加密密码
    try {
      // await sequelize.query(registerSQL, { logging: false });
      await this.userModel.create(
        {
          accountName: accountName,
          realName: realName,
          passwd: hashPwd,
          passwdSalt: salt,
          mobile: mobile,
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
}
