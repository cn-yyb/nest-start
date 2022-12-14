import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from '@/utils/cryptogram.utils';
import { users } from '@/database/models';
import { UserTokenSign } from './auth.interface';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // jwt 验证校验用户信息
  async validateUser(username: string, password: string) {
    const user: users = await this.userService.findOne(username);
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
  async certificate(user: users) {
    const { accountName, uid, role, status } = user;
    const payload = { username: accountName, uid, role, status };
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

  /**
   *  解析 token 返回token内的信息
   * @param token token
   * @param hasType 是否存在类型前缀 如: Bearer
   * @returns {UserTokenSign} UserTokenSign
   */
  async formatTokenInfo(token: string, hasType = true): Promise<UserTokenSign> {
    const _token = hasType ? token.split(' ')[1] : token;
    return await this.jwtService.verifyAsync(_token, {
      secret: jwtConstants.secret,
    });
  }
}
