import { WebSocket } from 'ws';

export interface CustomWebSocket extends WebSocket {
  id?: number | string;
  [x: string]: any;
}
