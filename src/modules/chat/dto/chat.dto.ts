/*
 * @Author: zq
 * @Date: 2023-01-05 16:13:09
 * @Last Modified by: zq
 * @Last Modified time: 2023-01-05 16:22:54
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ApplyFriendFormDto {
  @ApiProperty({
    description: '目标好友的uid',
  })
  @IsNotEmpty({ message: 'friendUid 不能为空' })
  @IsUUID('4', { message: 'friendUid 字段格式为 UUID4' })
  readonly friendUid: string;

  @ApiProperty({
    description: '申请人的uid',
  })
  @IsNotEmpty({ message: 'applicantUid 不能为空' })
  @IsUUID('4', { message: 'applicantUid 字段格式为 UUID4' })
  readonly applicantUid: string;

  @ApiProperty({
    description: '验证消息',
  })
  @IsNotEmpty({ message: 'verifyMsg 不能为空' })
  @IsString({ message: 'verifyMsg 字段为 String 类型' })
  readonly verifyMsg: string;
}
