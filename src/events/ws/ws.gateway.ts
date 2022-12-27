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

@WebSocketGateway(8001, {
  cors: {
    origin: '*',
  },
})
export class WsGateway
  implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit
{
  @WebSocketServer() server: WebSocket.Server;

  afterInit(server: WebSocket.Server) {
    Logger.log('websocket server init successfully!', 'websocket');

    // 此处可以监听 ws 各种事件(等同于 handleConnection)
    server.on('connection', (socket, req) => {
      // console.log(req.url);
      socket.on('close', () => {
        console.log('ws服务已关闭！');
      });
    });
  }

  handleConnection(client: CustomWebSocket, @Query() req: IncomingMessage) {
    console.log(req.url);
    // console.log(client, args);
    client.id = +new Date();
    console.log('新的连接进来了');
    // 校验连接信息，为连接对象绑定指定标识或者个人信息

    this.broadcast({
      event: 'enter',
      msg: 'new user enter!',
      data: `有新用户${client.id}进入房间！`,
      broadcastList: [],
      hasSelf: false,
      selfId: client.id,
    });
  }

  handleDisconnect(client: CustomWebSocket) {
    console.log('关闭了连接: ', client.id);
    // throw new Error('Method not implemented.');
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

  @SubscribeMessage('test2')
  test2(@MessageBody() data: any, @ConnectedSocket() client: CustomWebSocket) {
    console.log(data);

    client.send(
      JSON.stringify({
        event: 'test',
        data: [
          2,
          1,
          {
            did: '866545054719114',
            iccid: '89860617060069689883',
            imsi: '460060676058888',
            mver: '1.0.0_20210306',
          },
        ],
      }),
    );
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
