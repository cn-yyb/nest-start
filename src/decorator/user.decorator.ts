/*
 * @Author: zq
 * @Date: 2023-01-09 10:29:05
 * @Last Modified by: zq
 * @Last Modified time: 2023-01-09 11:51:17
 */

import { UserTokenSign } from '@/modules/auth/auth.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';

export const User = createParamDecorator((_data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as IncomingMessage;
  const token = request.headers['authorization'];
  const userJwtInfo = new JwtService().decode(
    token?.split(' ')[1] || '',
  ) as UserTokenSign;
  return userJwtInfo;
});
