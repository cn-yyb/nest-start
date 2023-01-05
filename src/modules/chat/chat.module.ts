import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { chatRoom, users } from '@/database/models';

@Module({
  imports: [SequelizeModule.forFeature([users, chatRoom])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
