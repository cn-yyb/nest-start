import {
  chatRoom,
  contact,
  contactGroup,
  userApply,
  users,
} from '@/database/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AgreeFriendApplicationDto, ApplyFriendFormDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(users) private userModel: typeof users,
    @InjectModel(chatRoom) private chatRoomModel: typeof chatRoom,
    @InjectModel(userApply) private userApplyModel: typeof userApply,
    @InjectModel(contact) private contactModel: typeof contact,
    @InjectModel(contactGroup) private contactGroupModel: typeof contactGroup,
  ) {}

  async applyNewFriend(applicationForm: ApplyFriendFormDto) {
    console.log('applyNewFriend');
    const { friendUid, applicantUid, verifyMsg } = applicationForm;

    // 将用户申请信息添加至申请名单内
    try {
      // 判断是否已经是好友
      const contactInfo = await this.contactModel.findOne({
        where: {
          uid: applicantUid,
          friendUid,
        },
      });

      if (contactInfo) {
        return {
          code: 1,
          msg: `已和uid：${friendUid}}互为好友！`,
        };
      }

      // 判断是否存在申请信息
      const [, created] = await this.userApplyModel.findOrCreate({
        where: {
          applyUid: applicantUid,
          friendUid,
        },
        defaults: {
          applyUid: applicantUid,
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

        // 判断是否存在初始默认分组
        const [chatGroupRecord] = await this.contactGroupModel.findOrCreate({
          where: {
            uid: record.applyUid,
            type: 0,
          },
          defaults: {
            uid: record.applyUid,
            type: 0,
            groupName: '我的好友',
            groupOrder: -1,
          },
        });

        const [firendchatGroupRecord] =
          await this.contactGroupModel.findOrCreate({
            where: {
              uid: record.friendUid,
              type: 0,
            },
            defaults: {
              uid: record.friendUid,
              type: 0,
              groupName: '我的好友',
              groupOrder: -1,
            },
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
            chatId: chatRoomRecord.id,
          });

          await friendContactRecord.update({
            chatId: chatRoomRecord.id,
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

  getChatRoomChatRecord() {
    console.log('getChatRoomChatRecord');
  }

  getChatRoomInfo() {
    console.log('getChatRoomInfo');
  }

  withdrawChatRecord() {
    console.log('rebackChatRecord');
  }

  getContactList() {
    console.log('rebackChatRecord');
  }

  getContectGroups() {
    console.log('getContectGroups');
  }
}
