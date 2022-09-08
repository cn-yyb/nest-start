import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserController } from './modules/user/user.controller';
import { StatusMonitorModule } from 'nestjs-status-monitor';
import statusMonitorConfig from './config/statusMonitor';
import * as path from 'path';
import { ConfigModule } from 'nestjs-config';

@Module({
  imports: [
    UserModule,
    AuthModule,
    StatusMonitorModule.forRoot(statusMonitorConfig),
    // ConfigModule.forRoot(),
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
