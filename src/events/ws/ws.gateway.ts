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

import { Server } from 'ws';
import * as dayjs from 'dayjs';

import {
  ChatMsgType,
  CustomWebSocket,
  MsgTypes,
  WSMsgType,
} from './interfaces/ws.interface';

import { CLIENT_EVENTS } from './events/client.events';
import { SERVER_EVENTS } from './events/server.events';
import { WsService } from './ws.service';
import { AuthService } from '@/modules/auth/auth.service';

@WebSocketGateway(8001, {
  cors: {
    origin: '*',
  },
})
export class WsGateway
  implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit
{
  constructor(
    private readonly wsService: WsService,
    private readonly authService: AuthService,
  ) {}

  // private readonly jwtService: JwtService = new JwtService();

  @WebSocketServer() public server: Server;

  get clients() {
    return this.server.clients as Set<CustomWebSocket>;
  }

  get clientCount() {
    return this.clients.size;
  }

  afterInit(server: Server) {
    Logger.log('websocket server init successfully!', 'websocket');
    // 此处可以监听 ws 各种事件(等同于 handleConnection)
    server.on('connection', (socket, _req) => {
      // console.log(req.url);
      socket.on('close', () => {
        console.log('======= websockets client is closed！ =======');
      });

      socket.on('error', () => {
        console.log('======= websockets error！ =======');
        this.wsService.clearAllClienter();
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
      // const jwtInfo: UserTokenSign = await this.jwtService.verifyAsync(token, {
      //   secret: jwtConstants.secret,
      // });
      const jwtInfo = await this.authService.formatTokenInfo(token, false);
      client.uid = jwtInfo.uid;

      this.wsService.pushOnlineClienter(jwtInfo.uid);

      console.log(
        'new client is connected, uid: ',
        jwtInfo.uid,
        `, online clienter count: ${this.wsService.clientCount}`,
      );
    } catch (error) {
      console.log('token verify error: ', error.toString());
      client.close(1008, 'Invalid token.');
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
      this.wsService.removeOnlineClienter(client.uid);
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

  @SubscribeMessage(SERVER_EVENTS.SEND_CHAT_MSG)
  async sendChatMsg(@MessageBody() { data }: WSMsgType<ChatMsgType>) {
    if (!data.contactId) return;
    const { receivers, responseData: msgData } =
      await this.wsService.handleClinetChat(data);

    this.sendClientsMsg(receivers, {
      event: CLIENT_EVENTS.RECEIVE_CHAT_MSG,
      data: msgData,
    });
  }

  /**
   * websocket 心跳检测
   * @param client
   * @returns
   */
  @SubscribeMessage(SERVER_EVENTS.PING)
  pingServer(@ConnectedSocket() client: CustomWebSocket) {
    return {
      event: CLIENT_EVENTS.PONG,
      data: {
        uid: client.uid,
      },
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

  /**
   * 消息发送(支持群发)
   * @param uids 指定需要发送的用户uid数组
   * @param msgData 消息数据
   * @param isAll 是否开启全体广播(为true时 uids 参数无效)
   */
  sendClientsMsg(uids: string[], msgData: object, isAll = false) {
    this.clients.forEach((client: CustomWebSocket) => {
      if (isAll || uids.includes(client.uid)) {
        msgData['time'] = dayjs().format('YYYY-MM-DD HH:mm:ss');
        client.send(JSON.stringify(msgData));
      }
    });
  }

  /**
   * 获取指定uid的连接对象
   * @param uid uid
   * @returns  websockt 连接对象
   */
  returnClientByUid(uid: string) {
    return [...this.clients].find((item) => item.uid === uid);
  }
}
