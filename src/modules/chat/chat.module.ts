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
  message,
} from '@/database/models';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { WsGateway } from '@/events/ws/ws.gateway';
import { WsModule } from '@/events/ws/ws.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      users,
      chatRoom,
      userApply,
      contact,
      contactGroup,
      userBlacklist,
      message,
    ]),
    JwtModule,
    AuthModule,
    WsModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
