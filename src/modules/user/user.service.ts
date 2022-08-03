import { Injectable } from '@nestjs/common';
import { UserInfoItem } from './interfaces/user.interface';
import * as Sequelize from 'sequelize'; // 引入 Sequelize 库
import sequelize from '@/database/sequelize'; // 引入 Sequelize 实例
import { encryptPassword, makeSalt } from '@/utils/cryptogram.utils';
import { RegisterUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  // 编辑和user模块相关的业务逻辑
  getUserList(): UserInfoItem[] {
    const userList = Array(10)
      .fill(null)
      .map((_v, i) => ({
        username: '张三-' + i + 1,
        nickName: 'zs' + i + 1,
        gender: Math.random() > 0.5 ? 1 : 0,
        birth: new Date(Math.random() * 100000).toLocaleString(),
        tel: 13488888888,
      }));
    return userList;
  }

  async findOne(username: string): Promise<any | undefined> {
    const sql = `
      SELECT
        user_id userId, account_name username, real_name realName, passwd password,
        passwd_salt salt, mobile, role
      FROM
        admin_user
      WHERE
        account_name = '${username}'
    `;
    try {
      const user = (
        await sequelize.query(sql, {
          type: Sequelize.QueryTypes.SELECT, // 查询方式
          raw: true, // 是否使用数组组装的方式展示结果
          logging: true, // 是否将 SQL 语句打印到控制台，默认为 true
        })
      )[0];

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async register(reqBody: RegisterUserDto): Promise<any> {
    const { accountName, realName, password, repassword, mobile } = reqBody;
    if (password !== repassword) {
      return {
        code: 400,
        msg: '两次密码输入不一致',
      };
    }
    const user = await this.findOne(accountName);
    if (user) {
      return {
        code: 400,
        msg: '用户已存在',
      };
    }

    const salt = makeSalt(); // 制作密码盐
    const hashPwd = encryptPassword(password, salt); // 加密密码
    const registerSQL = `
      INSERT INTO admin_user
        (account_name, real_name, passwd, passwd_salt, mobile, user_status, role, create_by)
      VALUES
        ('${accountName}', '${realName}', '${hashPwd}', '${salt}', '${mobile}', 1, 3, 0)
    `;

    try {
      await sequelize.query(registerSQL, { logging: false });
      return {
        code: 200,
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
