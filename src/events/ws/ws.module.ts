import { contact, message, users } from '@/database/models';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WsGateway } from './ws.gateway';
import { WsService } from './ws.service';

/**
 * WsModule 模块已在AppModule中导入, 外部模块使用WsModule模块服务请直接导入WsGateway后使用.
 */
@Module({
  providers: [WsGateway, WsService],
  exports: [WsGateway, WsService],
  imports: [
    UserModule,
    AuthModule,
    SequelizeModule.forFeature([contact, message, users]),
  ],
})
export class WsModule {}
