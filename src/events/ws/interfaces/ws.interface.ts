import { WebSocket } from 'ws';

export interface CustomWebSocket extends WebSocket {
  uid: string;
  [x: string]: any;
}

export interface MsgTypes {
  data: any;
  msg: string;
  event: string;
  broadcastList: number[];
  hasSelf?: boolean;
  selfId?: number;
  [x: string]: any;
}

export interface WSMsgType<T = any> {
  event: string;
  data: T;
  time: string;
  status?: number;
  meta?: object;
}

export interface ChatMsgType {
  contactId: number;
  msg: any;
}

export interface ReceiverMsg {
  receivers: string[];
  responseData: any;
}
