import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';

@Module({
  providers: [WsGateway],
  exports: [WsGateway],
  imports: [UserModule],
})
export class WsModule {}
