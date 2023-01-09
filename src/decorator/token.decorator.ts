import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IncomingMessage } from 'http';

export const Token = createParamDecorator(
  (schema = 'authorization', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as IncomingMessage;
    return request.headers[schema];
  },
);
