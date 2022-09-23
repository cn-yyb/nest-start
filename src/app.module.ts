import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserController } from './modules/user/user.controller';
import { StatusMonitorModule } from 'nestjs-status-monitor';
import statusMonitorConfig from './config/statusMonitor';
import * as path from 'path';
/**
 * nestjs-config
 * @desc 配合环境变量参数使用，使用 nestjs-config 模块管理配置参数
 * @url https://blog.csdn.net/lxmuyu/article/details/125102992
 */
import { ConfigModule } from 'nestjs-config';
import { WsGateway } from './events/ws/ws.gateway';
// import { WsModule } from './events/ws/ws.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    StatusMonitorModule.forRoot(statusMonitorConfig),
    // ConfigModule.forRoot(),
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    // WsModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, WsGateway],
})
export class AppModule {}
