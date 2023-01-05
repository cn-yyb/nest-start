import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  Length,
} from 'class-validator';

export class SendEmialVerifyCodeDto {
  @ApiProperty({ description: '邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不合法!' })
  readonly email: string;

  @ApiProperty({
    description: '标题',
    required: false,
    default: 'ZChat账号——邮箱验证',
  })
  @IsOptional()
  @IsString({ message: '标题数据类型应为 String 类型' })
  readonly subject: string;

  @ApiProperty({
    description: '签名',
    required: false,
    default: '系统邮件，请勿回复',
  })
  @IsOptional()
  @IsString({ message: '签名数据类型应为 String 类型' })
  readonly sign: string;
}

export class EmialVerifyDto {
  @ApiProperty({ description: '邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不合法!' })
  readonly email: string;

  @ApiProperty({ description: '验证码' })
  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString({ message: '验证码数据类型应为 String 类型' })
  @Length(6, 6, { message: '邮箱验证应为6个数字组成的字符串' })
  readonly emailCode: string;
}
