import { users, chatRoom, contactGroup } from '@/database/models';
import { WsModule } from '@/events/ws/ws.module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmailModule } from '../email/email.module';
// import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  // controllers: [UserController],
  imports: [
    SequelizeModule.forFeature([users, chatRoom, contactGroup]),
    EmailModule,
    // WsModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
