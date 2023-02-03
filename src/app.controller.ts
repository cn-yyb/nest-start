import { Controller, Get } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { AppService } from './app.service';
import { WsGateway } from './events/ws/ws.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly wsGateway: WsGateway,
    private readonly configService: ConfigService,
  ) {}

  @Get('test')
  async test() {
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

    console.log(this.configService.get('statusMonitor'));

    return {
      code: 0,
      data: {
        clientCount: this.wsGateway.clientCount,
        text: 'hello world!',
        config: this.configService.get('statusMonitor'),
      },
      msg: 'success',
    };
  }
}
