import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDateString,
  Length,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @ApiProperty({
    description: '用户名',
  })
  @IsNotEmpty({ message: '用户名不能为空！' })
  readonly accountName: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码不能为空！' })
  readonly password: string;

  @ApiProperty({ description: '重复密码' })
  @IsNotEmpty({ message: '重复密码不能为空' })
  readonly repassword: string;

  // @ApiProperty({ description: '手机号' })
  // @IsNotEmpty({ message: '手机号不能为空' })
  // @IsPhoneNumber('CN', {
  //   message: '手机号格式不合法!',
  // })
  // readonly mobile: string;

  @ApiProperty({ description: '邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不合法!' })
  readonly email: string;

  @ApiProperty({ description: '性别' })
  @IsNotEmpty({ message: '性别不能为空' })
  readonly gender: number;

  @ApiProperty({ description: '生日' })
  @IsDateString({}, { message: '请填写正确的（生日）时间格式' })
  readonly birthday: string;

  @ApiProperty({ description: '验证码' })
  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString({ message: '验证码格式应为字符串格式' })
  @Length(6, 6, { message: '邮箱验证应为6个数字组成的字符串' })
  readonly emailCode: string;
}

export class LoginDto {
  @ApiProperty({
    description: '用户名',
    example: 'zhangsan',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty({ message: 'file字段不能为空！' })
  readonly file: any;
}

export class GetUserInfoDto {
  @ApiProperty({
    description: '用户名',
    example: 'zhangsan',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '用户名数据类型应为 String 类型' })
  readonly username: string;

  @ApiProperty({
    description: 'uid',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'uid 数据类型应为 String 类型' })
  readonly uid: string;

  @ApiProperty({
    description: 'userId',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'userId 必须是整数类型' })
  readonly usreId: number;
}
