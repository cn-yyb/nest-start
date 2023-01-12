import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { WsGateway } from './events/ws/ws.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly wsGateway: WsGateway,
  ) {}

  @Get('test')
  test() {
    this.wsGateway.sendClientsMsg(
      [],
      {
        data: {
          msg: '群发消息测试',
          clientCount: this.wsGateway.clientCount,
        },
      },
      true,
    );
    return {
      code: 0,
      data: {
        clientCount: this.wsGateway.clientCount,
        text: 'hello world!',
      },
      msg: 'success',
    };
  }
}
