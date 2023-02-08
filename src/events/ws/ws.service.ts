import { contact, message, users } from '@/database/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatMsgType, ReceiverMsg } from './interfaces/ws.interface';

@Injectable()
export class WsService {
  constructor(
    @InjectModel(message) private messageModel: typeof message,
    @InjectModel(contact) private contactModel: typeof contact,
    @InjectModel(users) private usersModel: typeof users,
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

  async handleClinetChat(
    { contactId, msg }: ChatMsgType,
    selfUid: string,
  ): Promise<ReceiverMsg | null> {
    try {
      // 获取联系人信息
      const record = await this.contactModel.findOne({
        where: {
          contactId,
        },
        logging: true,
      });

      // 避免使用他人账号给自己发消息
      if (!record || record.uid !== selfUid || record.uid !== selfUid) {
        return null;
      }

      if (record) {
        // 记录聊天记录, 判断消息接收者是否在线,并记录未读信息至数据库(在用户登录时,将未读信息返回给用户)
        const newChatRecord = await this.messageModel.create(
          {
            senderId: record.uid,
            receiverId: record.friendUid,
            chatId: record.chatId,
            content: msg,
            status: this.hasOnlineClienter(record.friendUid) ? 1 : 0,
          },
          {
            raw: true,
          },
        );

        // 获取发送人用户基本信息
        const userBaseInfo = await this.usersModel.findOne({
          attributes: ['avatar', 'uid', 'nickName', 'gender', 'accountName'],
          where: {
            uid: selfUid,
          },
          raw: true,
        });

        // 判断联系人类型(私聊&群聊)
        if (record.type === 0) {
          return {
            receivers: [record.friendUid, record.uid],
            responseData: {
              contactId: contactId,
              chatId: record.chatId,
              ...newChatRecord.toJSON(),
              user: userBaseInfo,
            },
          };
        } else {
          // 获取指定群聊的全部用户(除自己)
          const groupUsers = await this.contactModel.findAll({
            // where: {
            //   chatId: {
            //     [Op.or]: [record.uid],
            //   },
            // },
            attributes: ['uid'],
            raw: true,
            logging: true,
          });
          return {
            receivers: groupUsers.map((v) => v.uid),
            responseData: {
              contactId: contactId,
              chatId: record.chatId,
              ...newChatRecord.toJSON(),
              user: userBaseInfo,
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
