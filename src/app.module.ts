import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserController } from './modules/user/user.controller';
import { StatusMonitorModule } from 'nestjs-status-monitor';
import statusMonitorConfig from './config/statusMonitor';

@Module({
  imports: [
    UserModule,
    AuthModule,
    StatusMonitorModule.forRoot(statusMonitorConfig),
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
