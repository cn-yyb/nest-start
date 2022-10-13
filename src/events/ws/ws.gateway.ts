import { Logger } from '@nestjs/common';
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
import * as WebSocket from 'ws';
import { CustomWebSocket } from './interfaces/ws.interface';

@WebSocketGateway(8001, {
  cors: {
    origin: '*',
  },
})
export class WsGateway
  implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit
{
  @WebSocketServer() server: WebSocket.Server;

  afterInit(_server: WebSocket.Server) {
    Logger.log('websocket server init successfully!', 'websocket');
  }

  handleConnection(client: CustomWebSocket) {
    // console.log(client, args);
    client.id = +new Date();
    console.log('新的连接进来了');
  }

  handleDisconnect(client: CustomWebSocket) {
    console.log('关闭了连接: ', client.id);
    // throw new Error('Method not implemented.');
  }

  @SubscribeMessage('msg')
  msg(@MessageBody() data: any): any {
    // console.log(this.server.clients.size);

    // return {
    //   event: 'msg',
    //   data: data,
    //   msg: 'rustfisher.com',
    // };

    this.broadcast(data);
  }

  @SubscribeMessage('hello2')
  hello2(@MessageBody() data: any, @ConnectedSocket() client: WebSocket): any {
    // console.log('收到消息 client:', client);

    client.send(JSON.stringify({ event: 'tmp', data: '收到消息啦,' + data }));
  }

  broadcast(msg: string) {
    //server.clients:表示给所用用户发送消息

    this.server.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          event: 'msg',
          data: `广播消息：${msg},${new Date().toLocaleString()}`,
        }),
      );
    });
  }
}
