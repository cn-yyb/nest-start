import { Logger, Query } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';

import * as WebSocket from 'ws';
import {
  CustomWebSocket,
  MsgTypes,
  WSMsgType,
} from './interfaces/ws.interface';

import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '@/modules/auth/constants';
import { UserTokenSign } from '@/modules/auth/auth.interface';
import { SERVER_EVENTS } from './events/server.events';
import * as dayjs from 'dayjs';
import { CLIENT_EVENTS } from './events/client.events';

@WebSocketGateway(8001, {
  cors: {
    origin: '*',
  },
})
export class WsGateway
  implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit
{
  private clienters: Set<string> = new Set();
  private readonly jwtService: JwtService = new JwtService();

  @WebSocketServer() server: WebSocket.Server;

  afterInit(server: WebSocket.Server) {
    Logger.log('websocket server init successfully!', 'websocket');
    // 此处可以监听 ws 各种事件(等同于 handleConnection)
    server.on('connection', (socket, _req) => {
      // console.log(req.url);
      socket.on('close', () => {
        console.log('======= websockets client is closed！ =======');
      });

      socket.on('error', () => {
        console.log('======= websockets error！ =======');
        this.clienters.clear();
      });
    });
  }

  async handleConnection(
    client: CustomWebSocket,
    @Query() req: IncomingMessage,
  ) {
    const token = req.headers['sec-websocket-protocol'] || '';

    // 解析token数据
    try {
      const jwtInfo: UserTokenSign = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      client.uid = jwtInfo.uid;
      this.clienters.add(jwtInfo.uid);

      console.log('new client is connected, uid: ', jwtInfo.uid, [
        ...this.clienters,
      ]);
    } catch (error) {
      console.log('token verify error: ', error.toString());
      client.close(1008, 'Invalid token. 无效 token');
    }

    // client.id = +new Date();
    // console.log('新的连接进来了');
    // 校验连接信息，为连接对象绑定指定标识或者个人信息

    // this.broadcast({
    //   event: 'enter',
    //   msg: 'new user enter!',
    //   data: `有新用户${client.id}进入房间！`,
    //   broadcastList: [],
    //   hasSelf: false,
    //   selfId: client.id,
    // });
  }

  handleDisconnect(client: CustomWebSocket) {
    if (client.uid) {
      console.log('clienter is disconneted, uid:', client.uid);
      this.clienters.delete(client.uid);
    }
  }

  @SubscribeMessage('msg')
  msg(
    @MessageBody() data: any,
    @ConnectedSocket() client: CustomWebSocket,
  ): any {
    // console.log(this.server.clients.size);

    // return {
    //   event: 'msg',
    //   data: data,
    //   msg: 'rustfisher.com',
    // };
    this.broadcast({
      event: 'msg',
      msg: 'broadcast message',
      data,
      broadcastList: [],
      selfId: client.id,
      hasSelf: false,
    });
  }

  @SubscribeMessage('test')
  hello2(
    @MessageBody() body: WSMsgType,
    @ConnectedSocket() client: CustomWebSocket,
  ): any {
    // console.log('收到消息 client:', client);

    client.send(
      JSON.stringify({ event: 'test', data: '收到数据：' + body.data }),
    );
  }

  @SubscribeMessage(SERVER_EVENTS.PING)
  pingServer() {
    return {
      event: CLIENT_EVENTS.PONG,
      data: null,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  broadcast(msg: MsgTypes) {
    //server.clients:表示给所用用户发送消息
    const responseData = JSON.stringify({
      event: msg.event,
      data: msg.data,
      msg: msg.msg,
      time: new Date().toLocaleString(),
      userId: msg.selfId,
    });

    this.server.clients.forEach((client: CustomWebSocket) => {
      if (msg.broadcastList?.length) {
        msg.hasSelf && msg.selfId && msg.broadcastList.push(msg.selfId);
        if (msg.broadcastList.includes(client.id)) {
          client.send(responseData);
        }
      } else {
        if (msg.hasSelf) {
          client.send(responseData);
        } else {
          msg.selfId !== client.id && client.send(responseData);
        }
      }
    });
  }
}
