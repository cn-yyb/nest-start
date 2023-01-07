import { contact, message } from '@/database/models';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WsGateway } from './ws.gateway';
import { WsService } from './ws.service';

@Module({
  providers: [WsGateway, WsService],
  exports: [WsGateway, WsService],
  imports: [
    UserModule,
    AuthModule,
    SequelizeModule.forFeature([contact, message]),
  ],
})
export class WsModule {}
