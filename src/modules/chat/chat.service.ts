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

        // 获取用户昵称作为联系人名称
        const [applyUser, firendUser] = await this.userModel.findAll({
          attributes: ['nickName'],
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
            // contactName: firendUser.nickName,
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
              // contactName: applyUser.nickName,
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

  getChatRoomInfo() {
    console.log('getChatRoomInfo');
  }

  withdrawChatRecord() {
    console.log('rebackChatRecord');
  }

  async getContactList(token: string) {
    console.log('rebackChatRecord');
    try {
      const userInfo = await this.authService.formatTokenInfo(token);

      const record = await this.contactModel.findAll({
        where: {
          uid: userInfo.uid,
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

  getContectGroups() {
    console.log('getContectGroups');
  }
}
