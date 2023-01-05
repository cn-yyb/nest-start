import { chatRoom, users } from '@/database/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApplyFriendFormDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(users) private userModel: typeof users,
    @InjectModel(chatRoom) private chatRoomModel: typeof chatRoom,
  ) {}

  applyNewFriend(applicationForm: ApplyFriendFormDto) {
    console.log('applyNewFriend');
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
