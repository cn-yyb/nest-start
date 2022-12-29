import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from '@/utils/cryptogram.utils';
import { adminUser } from '@/database/models';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // jwt 验证校验用户信息
  async validateUser(username: string, password: string) {
    const user: adminUser = await this.userService.findOne(username);
    if (user) {
      const { password: pw, passwordSalt } = user;
      // console.log(user);
      if (pw === encryptPassword(password, passwordSalt)) {
        return {
          code: 0,
          msg: '校验成功！',
          user,
        };
      } else {
        return {
          code: 1,
          msg: '密码错误！',
          user: null,
        };
      }
    } else {
      return {
        code: 2,
        msg: '未注册用户！',
        user: null,
      };
    }
  }

  // jwt 生成用户token
  async certificate(user: any) {
    const { username, userId, realName, role } = user;
    const payload = { username, userId, realName, role };
    try {
      return {
        code: 0,
        msg: 'success',
        data: {
          token: this.jwtService.sign(payload),
        },
      };
    } catch (error) {
      return {
        code: 1,
        msg: error,
      };
    }
  }
}
