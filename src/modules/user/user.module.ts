import { users, chatRoom } from '@/database/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  // controllers: [UserController],
  imports: [SequelizeModule.forFeature([users, chatRoom])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
