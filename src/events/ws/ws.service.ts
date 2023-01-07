import { contact, message } from '@/database/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ChatMsgType, ReceiverMsg } from './interfaces/ws.interface';

@Injectable()
export class WsService {
  constructor(
    @InjectModel(message) private messageModel: typeof message,
    @InjectModel(contact) private contactModel: typeof contact,
  ) {}

  private clienters: Set<string> = new Set();

  get clientCount(): number {
    return this.clienters.size;
  }

  pushOnlineClienter(uid: string) {
    this.clienters.add(uid);
  }

  removeOnlineClienter(uid: string) {
    this.clienters.delete(uid);
  }

  clearAllClienter() {
    this.clienters.clear();
  }

  hasOnlineClienter(uid: string): boolean {
    return this.clienters.has(uid);
  }

  async handleClinetChat({
    contactId,
    msg,
  }: ChatMsgType): Promise<ReceiverMsg> {
    try {
      // 获取联系信息
      const record = await this.contactModel.findOne({
        where: {
          contactId,
        },
        logging: true,
      });

      if (record) {
        // 记录聊天记录
        this.messageModel.create({
          senderId: record.uid,
          receiverId: record.friendUid,
          chatId: record.chatId,
          content: msg,
        });

        // 判断联系人类型(私聊&群聊)
        if (record.type === 0) {
          return {
            receivers: [record.friendUid],
            responseData: {
              contactId: contactId,
              chatId: record.chatId,
              msg,
            },
          };
        } else {
          // 获取指定群聊的全部用户(除自己)
          const groupUsers = await this.contactModel.findAll({
            where: {
              chatId: {
                [Op.or]: [record.uid],
              },
            },
            raw: true,
            logging: true,
          });
          return {
            receivers: groupUsers.map((v) => v.uid),
            responseData: {
              contactId: contactId,
              chatId: record.chatId,
              msg,
            },
          };
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
