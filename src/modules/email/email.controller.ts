import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmialVerifyDto, SendEmialVerifyCodeDto } from './dto/email.dto';
import { EmailService } from './email.service';
import { ValidationPipe } from '@/pipe/validation.pipe';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  // send email verify code
  @ApiOperation({ summary: '发送邮箱验证码' })
  @ApiBody({
    description: '发送邮箱验证码',
    type: SendEmialVerifyCodeDto,
  })
  @UsePipes(new ValidationPipe())
  @Post('sendCode')
  async sendCode(@Body() body: SendEmialVerifyCodeDto) {
    return this.emailService.sendEmailCode(body);
  }

  // verify email code
  @ApiOperation({ summary: '校验邮箱验证码' })
  @ApiBody({
    description: '校验邮箱验证码',
    type: EmialVerifyDto,
  })
  @UsePipes(new ValidationPipe())
  @Post('verifyCode')
  async verifyCode(@Body() body: EmialVerifyDto) {
    return this.emailService.verifyEmailCode(body);
  }
}
