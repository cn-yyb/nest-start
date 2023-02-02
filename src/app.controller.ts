import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AppService } from './app.service';
import {
  chatRoom,
  contact,
  contactGroup,
  message,
  userApply,
  userBlacklist,
  users,
} from './database/models';
import { WsGateway } from './events/ws/ws.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly wsGateway: WsGateway,
    @InjectModel(users) private userModel: typeof users,
    @InjectModel(chatRoom) private chatRoomModel: typeof chatRoom,
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
    const data = await this.userModel.findAll({
      include: [
        {
          model: contact,
        },
        {
          model: contactGroup,
          include: [
            {
              model: contact,
            },
          ],
        },
        {
          model: userBlacklist,
        },
        {
          model: message,
        },
        {
          model: userApply,
        },
      ],
      logging: true,
    });

    const chatRecored = await this.chatRoomModel.findAll({
      include: [
        {
          model: contact,
        },
        {
          model: message,
        },
      ],
    });

    console.log(data);
    return {
      code: 0,
      data: {
        clientCount: this.wsGateway.clientCount,
        text: 'hello world!',
        data,
        chatRecored,
      },
      msg: 'success',
    };
  }
}
