import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly tel: number;
}

export class RegisterUserDto {
  @ApiProperty({
    description: '用户名',
  })
  @IsNotEmpty({ message: '用户名不能为空！' })
  readonly accountName: string;

  @ApiProperty({ description: '真实姓名' })
  @IsNotEmpty({ message: '真实姓名不能为空！' })
  @IsString({ message: '真实姓名必须是是 String 类型' })
  readonly realName: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码不能为空！' })
  readonly password: string;

  @ApiProperty({ description: '重复密码' })
  @IsNotEmpty({ message: '重复密码不能为空' })
  readonly repassword: string;

  @ApiProperty({ description: '手机号' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsPhoneNumber('CN')
  @IsNumber()
  readonly mobile: number;

  @ApiProperty({
    required: false,
    description:
      '[用户角色]: 0-超级管理员 | 1-管理员 | 2-开发&测试&运营 | 3-普通用户（只能查看）',
  })
  readonly role?: number | string;
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
