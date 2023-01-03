import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmialVerifyDto } from './dto/email.dto';
import { EmailService } from './email.service';
import { ValidationPipe } from '@/pipe/validation.pipe';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @ApiOperation({ summary: '邮箱验证' })
  @ApiBody({
    description: '邮箱验证',
    type: EmialVerifyDto,
  })
  @UsePipes(new ValidationPipe()) // 使用管道验证
  @Post('sendCode')
  async sendCode(@Body() body: EmialVerifyDto) {
    return this.emailService.sendEmailCode(body);
  }
}
