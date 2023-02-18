import {
  chatRoom,
  contact,
  contactGroup,
  message,
  userApply,
  userBlacklist,
  users,
} from '@/database/models';
import { WsGateway } from '@/events/ws/ws.gateway';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AuthService } from '../auth/auth.service';
import {
  AgreeFriendApplicationDto,
  ApplyFriendFormDto,
  RequestChatRecordDto,
} from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(users) private userModel: typeof users,
    @InjectModel(chatRoom) private chatRoomModel: typeof chatRoom,
    @InjectModel(userApply) private userApplyModel: typeof userApply,
    @InjectModel(contact) private contactModel: typeof contact,
    @InjectModel(contactGroup) private contactGroupModel: typeof contactGroup,
    @InjectModel(userBlacklist) private userBacklistModel: typeof userBlacklist,
    @InjectModel(message) private messageModel: typeof message,
    private readonly authService: AuthService,
    private readonly wsGateway: WsGateway,
  ) {}

  /**
   * 发送用户好友申请
   * @param applicationForm
   * @param token
   * @returns
   */
  async applyNewFriend(applicationForm: ApplyFriendFormDto, token: string) {
    console.log('applyNewFriend');
    const { friendUid, verifyMsg } = applicationForm;

    // 将用户申请信息添加至申请名单内
    try {
      const userInfo = await this.authService.formatTokenInfo(token);

      if (userInfo.uid === friendUid) {
        return {
          code: 3,
          msg: '不能添加自己为好友!',
        };
      }
      // 拉黑判断
      const blackListRecord = await this.userBacklistModel.findOne({
        where: {
          uid: friendUid,
          targetUid: userInfo.uid,
        },
      });

      if (blackListRecord) {
        return {
          code: 4,
          msg: '你已经被对方拉黑,不能添加为好友!',
        };
      }

      // 判断是否已经是好友
      const contactInfo = await this.contactModel.findOne({
        where: {
          uid: userInfo.uid,
          friendUid,
        },
      });

      if (contactInfo) {
        return {
          code: 1,
          msg: `已和uid：${friendUid}互为好友！`,
        };
      }

      // 判断是否存在申请信息
      const [, created] = await this.userApplyModel.findOrCreate({
        where: {
          applyUid: userInfo.uid,
          friendUid,
        },
        defaults: {
          applyUid: userInfo.uid,
          friendUid,
          verifyMsg,
        },
      });

      if (created) {
        return {
          code: 0,
          msg: '发送好友申请成功，请耐心等待通过',
        };
      } else {
        return {
          code: 2,
          msg: '好友申请已发送，请耐心等待通过',
        };
      }
    } catch (error) {
      console.log('ApplyNewFried Error: ', error);
      throw error;
    }
  }

  /**
   *  同意好友申请
   * @param param0
   * @returns
   */
  async agreeFirendAppliaction({ id }: AgreeFriendApplicationDto) {
    try {
      // 判断当前申请是否存在
      const record = await this.userApplyModel.findOne({
        where: {
          id,
        },
      });

      if (record) {
        // 更新记录
        await record.update({
          status: 1,
        });

        const [chatGroupRecord, firendchatGroupRecord] =
          await this.contactGroupModel.findAll({
            where: {
              uid: {
                [Op.or]: [record.applyUid, record.friendUid],
              },
            },
            raw: true,
          });

        // 更新联系人记录
        const [contactRecord, created] = await this.contactModel.findOrCreate({
          where: {
            uid: record.applyUid,
            friendUid: record.friendUid,
          },
          defaults: {
            uid: record.applyUid,
            friendUid: record.friendUid,
            type: 0,
            groupId: chatGroupRecord.groupId,
          },
          paranoid: false,
        });

        const [friendContactRecord, firendCreated] =
          await this.contactModel.findOrCreate({
            where: {
              uid: record.friendUid,
              friendUid: record.applyUid,
            },
            defaults: {
              uid: record.friendUid,
              friendUid: record.applyUid,
              type: 0,
              groupId: firendchatGroupRecord.groupId,
            },
            paranoid: false,
          });

        if (!created) {
          await contactRecord.restore();
        }

        if (!firendCreated) {
          await friendContactRecord.restore();
        }

        if (created && firendCreated) {
          // 分配房间
          const chatRoomRecord = await this.chatRoomModel.create();

          await contactRecord.update({
            chatId: chatRoomRecord.chatId,
          });

          await friendContactRecord.update({
            chatId: chatRoomRecord.chatId,
          });
        }

        return {
          code: 0,
          msg: '好友申请通过！',
        };
      } else {
        return {
          code: 1,
          msg: '该好友申请不存在',
        };
      }
    } catch (error) {
      console.log('agreeFirendAppliaction error: ', error);
      throw error;
    }
  }

  addFriendToBackList() {
    console.log('addFriendToBackList');
  }

  removeFriend() {
    console.log('removeFriend');
  }

  /**
   * 获取指定聊天室的聊天记录
   * @param data
   * @param selfUid
   * @returns
   */
  async getChatRoomChatRecord(data: RequestChatRecordDto, selfUid: string) {
    console.log('getChatRoomChatRecord');

    const current = parseInt(data.current + '') || 1;
    const pageSize = parseInt(data.pageSize + '') || 20;

    try {
      const { count, rows } = await this.messageModel.findAndCountAll({
        attributes: {
          exclude: ['deletedAt'],
        },
        where: {
          chatId: data.chatId,
        },
        include: [
          {
            model: users,
            attributes: ['accountName', 'nickName', 'gender', 'avatar', 'uid'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: pageSize,
        offset: (current - 1) * pageSize,
      });

      // * 注意当清除前用户未读的数据(一当获取历史记录，即表示需要清除掉当前聊天室自己的未读消息)
      await this.messageModel.update(
        { status: 1 },
        {
          where: {
            receiverId: selfUid,
            chatId: data.chatId,
          },
        },
      );

      return {
        code: 0,
        msg: 'success',
        data: {
          current,
          pageSize,
          pages: Math.ceil(count / pageSize),
          total: count,
          // JSON.parse(JSON.stringfy(rows)) // 简便， 但不推荐
          data: rows
            .map((v) => {
              const value = v.get({ plain: true }) as any;
              value.isSelf = v.senderId === selfUid;
              return value;
            })
            .reverse(),
          time: +new Date(),
        },
      };
    } catch (error) {
      // throw error;
    }
  }

  /**
   * 获取指定聊天室信息
   * @param chatId
   */
  async getChatRoomInfo(chatId: number) {
    try {
      const record = await this.chatRoomModel.findOne({
        attributes: {
          exclude: ['deletedAt'],
        },
        where: {
          chatId,
        },
        include: [
          {
            model: users,
            attributes: ['accountName', 'nickName', 'gender', 'avatar', 'uid'],
          },
        ],
      });

      return {
        code: 0,
        msg: 'success',
        data: record,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createPublicChatRoom() {
    console.log('createPublicChatRoom');
  }

  applyJoinToPublicChatRoom() {
    console.log('applyToPublicChatRoom');
  }

  agreePublicChatRoomAppliaction() {
    console.log('agreePublicChatRoomAppliaction');
  }

  updatePublicChatRoomInfo() {
    console.log('updatePublicChatRoomInfo');
  }

  withdrawChatRecord() {
    console.log('withdrawChatRecord');
  }

  /**
   * 获取联系人列表
   * @param uid
   * @returns
   */
  async getContactList(uid: string) {
    console.log('rebackChatRecord');
    try {
      const record = await this.contactModel.findAll({
        where: {
          uid,
          type: 0,
        },
        attributes: {
          exclude: ['uid', 'deletedAt'],
        },
        include: [
          {
            model: users,
            attributes: {
              exclude: [
                'password',
                'passwordSalt',
                'realName',
                'mobile',
                'email',
                'role',
                'deletedAt',
              ],
            },
          },
        ],
        // raw: true,
        logging: true,
      });

      return {
        code: 0,
        msg: 'success',
        data: JSON.parse(JSON.stringify(record)).map((item) => {
          item.isOnline = this.wsGateway.hasClientOnline(item.user.uid);
          return item;
        }),
      };
    } catch (error) {
      console.log('rebackChatRecord Error:', error);
      throw error;
    }
  }

  createNewContactGroup() {
    console.log('addNewContactGroup');
  }

  removeContactGroup() {
    console.log('removeContactGroup');
  }

  updateContactGroup() {
    console.log('updateContactGroup');
  }

  getPublicChatRoomList() {
    console.log('getPublicChatRoomList');
  }

  /**
   * 获取联系人分组列表
   * @param uid
   * @returns
   */
  async getContectGroups(uid: string) {
    console.log('getContectGroups');
    try {
      const record = await this.contactGroupModel.findAll({
        attributes: {
          exclude: ['deletedAt'],
        },
        order: [['groupOrder', 'ASC']],
        where: { uid, type: 0 },
        include: [
          {
            model: contact,
            attributes: {
              exclude: ['uid', 'deletedAt'],
            },
            include: [
              {
                model: users,
                attributes: {
                  exclude: [
                    'password',
                    'passwordSalt',
                    'realName',
                    'mobile',
                    'email',
                    'role',
                    'deletedAt',
                  ],
                },
              },
            ],
          },
        ],
      });

      return {
        code: 0,
        msg: 'success',
        data: JSON.parse(JSON.stringify(record)).map((item) => {
          let onlineTotal = 0;
          item.contacts.forEach((v) => {
            const hasOnline = this.wsGateway.hasClientOnline(v.user.uid);

            hasOnline && onlineTotal++;

            v.isOnline = hasOnline;
          });
          item.onlineTotal = onlineTotal;
          return item;
        }),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   *  获取离线状态下接收到的未读信息(私聊)
   * @param uid {String}
   */
  async getUnreadChatRecords(uid: string) {
    try {
      const privateContacts = await this.contactModel.findAll({
        attributes: {
          exclude: ['deletedAt'],
        },
        where: {
          uid,
          type: 0,
        },
      });

      const { count, rows } = await this.userModel.findAndCountAll({
        attributes: ['accountName', 'nickName', 'gender', 'avatar', 'uid'],
        where: {
          uid: privateContacts.map((v) => v.friendUid),
        },
        include: [
          {
            model: message,
            where: {
              receiverId: uid,
              status: 0,
            },
            attributes: {
              exclude: ['deletedAt'],
            },
          },
        ],
      });

      const _privateContacts = JSON.parse(JSON.stringify(privateContacts));

      return {
        code: 0,
        msg: 'success',
        data: {
          total: count,
          record: rows
            .filter((v) => v.messages.length)
            .map((item) => {
              const { messages, accountName, nickName, gender, avatar, uid } =
                item;
              const unreadCount = messages.length;
              const lastMsg = messages[messages.length - 1];
              const contact = _privateContacts.find((v) => v.friendUid === uid);
              contact.isOnline = this.wsGateway.hasClientOnline(uid);

              return {
                unreadCount,
                contact,
                user: {
                  accountName,
                  nickName,
                  gender,
                  avatar,
                  uid,
                },
                lastMsg,
              };
            }),
        },
      };
    } catch (error) {
      console.log('error:', error);
      throw error;
    }
  }

  unsubscribeChatRoom() {
    console.log('updateChatRoomInfo');
  }

  /**
   * 获取私聊联系人的信息
   * @param contactId
   */
  async getOneContactInfo({ contactId }) {
    try {
      const record = await this.contactModel.findOne({
        attributes: {
          exclude: ['deletedAt'],
        },
        where: {
          contactId,
        },
        include: [
          {
            model: users,
            attributes: ['accountName', 'nickName', 'gender', 'avatar', 'uid'],
          },
          {
            model: chatRoom,
            attributes: {
              exclude: ['deletedAt'],
            },
          },
        ],
      });

      return {
        code: 0,
        message: 'success',
        data: record,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getUserContactList(uid: string) {
    try {
      const record = await this.contactModel.findAll({
        attributes: {
          exclude: ['deletedAt'],
        },
        where: {
          uid,
        },
        include: [
          {
            model: chatRoom,
            attributes: {
              exclude: ['deletedAt'],
            },
          },
          {
            model: users,
            attributes: ['accountName', 'nickName', 'gender', 'avatar', 'uid'],
          },
        ],
      });

      const data = JSON.parse(JSON.stringify(record)).map((item) => {
        const { user, type } = item;
        item.isOnline =
          type === 1 ? true : this.wsGateway.hasClientOnline(user?.uid);
        return item;
      });
      return {
        code: 0,
        msg: 'success',
        data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getOnlineContactId(uid: string) {
    try {
      const record = await this.contactModel.findAll({
        attributes: {
          include: ['contactId'],
        },
        where: {
          uid,
          type: 0,
        },
      });

      return {
        code: 0,
        msg: 'success',
        data: record
          .filter((v) => this.wsGateway.hasClientOnline(v.friendUid))
          .map((v) => v.contactId),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
