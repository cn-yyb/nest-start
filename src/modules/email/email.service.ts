import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import * as moment from 'moment';
import { EmialVerifyDto } from './dto/email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * 发送邮件验证码
   * @param data 邮件主体信息
   */
  async sendEmailCode(data: EmialVerifyDto) {
    try {
      const code = Math.random().toString().slice(-6);
      const date = moment().format('YYYY-MM-DD HH:mm');
      const sendMailOptions: ISendMailOptions = {
        to: data.email,
        subject: data.subject || 'ZChat账号--邮箱验证',
        template: 'validate_email.ejs', //模板名称，
        //内容部分都是自定义的
        context: {
          code, //验证码
          date, //日期
          sign: data.sign || '系统邮件，回复无效', //发送的签名,当然也可以不要
        },
        // attachments: [
        //   {
        //     filename: 'vaildate_code.ejs', //文件名
        //     path: join(__dirname, './template/validate_code.ejs'), //服务端的文件地址
        //   },
        // ],
      };
      await this.mailerService.sendMail(sendMailOptions);

      return { code: 0, msg: 'success' };
    } catch (error) {
      throw error;
    }
  }
}
