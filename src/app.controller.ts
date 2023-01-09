import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { WsGateway } from './events/ws/ws.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly ws: WsGateway,
  ) {}

  @Get('getHello')
  getHello() {
    this.ws.sendClientsMsg([], { data: '2222222222' }, true);
    return 'Hello world!';
  }
}
