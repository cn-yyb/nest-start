import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { EmialVerifyDto, SendEmialVerifyCodeDto } from './dto/email.dto';
import { UpdateEmailVerify } from './types/emial.type';
import { emailVerify } from '@/database/models';
import { InjectModel } from '@nestjs/sequelize';
import * as dayjs from 'dayjs';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(emailVerify) private emailVerifyModel: typeof emailVerify,
  ) {}

  /**
   * 发送邮件验证码
   * @param data 邮件主体信息
   */
  async sendEmailCode(data: SendEmialVerifyCodeDto) {
    try {
      const code = Math.random().toString().slice(-6);
      const date = dayjs().format('YYYY-MM-DD HH:mm');
      const sendMailOptions: ISendMailOptions = {
        to: data.email,
        subject: data.subject || 'ZChat账号--邮箱验证',
        template: 'validate_email.ejs', //模板名称
        //内容部分都是自定义的
        context: {
          code, //验证码
          date, //日期
          sign: data.sign || '系统邮件，回复无效', //发送的签名
        },
        // attachments: [
        //   {
        //     filename: 'vaildate_code.ejs', //文件名
        //     path: join(__dirname, './template/validate_code.ejs'), //服务端的文件地址
        //   },
        // ],
      };
      await this.mailerService.sendMail(sendMailOptions);

      // 存储邮箱验证码信息
      await this.updateEmailVerifyInfo({
        indate: 30 * 60 * 1000,
        emailCode: code,
        email: data.email,
      });

      return { code: 0, msg: 'success' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 更新（创建）验证记录
   * @param data {UpdateEmailVerify} 验证记录信息
   */
  async updateEmailVerifyInfo(data: UpdateEmailVerify) {
    try {
      const { indate, email, emailCode: verifyCode } = data;

      // 查找是否存在该邮箱的验证记录
      const [verifyRecord, created] = await this.emailVerifyModel.findOrCreate({
        where: {
          email,
        },
        defaults: {
          indate,
          email,
          verifyCode,
          expirationTime: new Date(+new Date() + indate),
        },
      });

      if (!created) {
        const _expirationTime = +new Date(verifyRecord.updatedAt) + indate;
        // 更新数据
        await verifyRecord.update({
          verifyCode,
          indate,
          expirationTime: new Date(_expirationTime),
        });
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 校验验证码
   * @param data {VerifyEmailCodeParmas} 验证信息
   * @returns
   */
  async verifyEmailCode(data: EmialVerifyDto) {
    try {
      const { emailCode, email } = data;

      const verifyRecord = await this.emailVerifyModel.findOne({
        where: {
          email,
        },
      });

      if (verifyRecord) {
        const { expirationTime, verifyCode } = verifyRecord;
        if (dayjs().isAfter(expirationTime)) {
          // 已过有效期
          return {
            code: 2,
            msg: '验证码已过期，请重新发送',
          };
        } else {
          if (emailCode === verifyCode) {
            return {
              code: 0,
              msg: '验证通过！',
            };
          } else {
            return {
              code: 1,
              msg: '验证码错误',
            };
          }
        }
      } else {
        return {
          code: 1,
          msg: '验证码错误',
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
