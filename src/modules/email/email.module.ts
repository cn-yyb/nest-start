import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
import { emailVerify } from '@/database/models';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.163.com', //邮箱服务器地址
        port: 465, //服务器端口 默认 465
        auth: {
          user: 'sdpzhong@163.com', //发送邮箱地址
          pass: 'BYPZQQTEKHBJCLJE', // 登录码
        },
      },
      preview: false, //是否开启预览，开启了这个属性，在调试模式下会自动打开一个网页，预览邮件
      defaults: {
        from: 'sdpzhong@163.com', //发送人邮箱地址
      },
      template: {
        dir: join(process.cwd(), '/src/template/email/'), //ejs模板文件夹路径
        adapter: new EjsAdapter(),
        options: {
          strict: true, //严格模式
        },
      },
    }),
    SequelizeModule.forFeature([emailVerify]),
  ],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
