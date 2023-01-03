import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator';

export class EmialVerifyDto {
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
  @IsString({ message: '标题格式为字符串类型' })
  readonly subject: string;

  @ApiProperty({
    description: '签名',
    required: false,
    default: '系统邮件，请勿回复',
  })
  @IsOptional()
  @IsString({ message: '签名格式为字符串类型' })
  readonly sign: string;
}
