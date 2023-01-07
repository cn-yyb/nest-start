import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  chatRoom,
  contact,
  contactGroup,
  userApply,
  users,
  userBlacklist,
} from '@/database/models';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      users,
      chatRoom,
      userApply,
      contact,
      contactGroup,
      userBlacklist,
    ]),
    JwtModule,
    AuthModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
