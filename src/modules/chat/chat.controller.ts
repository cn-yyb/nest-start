import { Token, User } from '@/decorator';
import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserTokenSign } from '../auth/auth.interface';
import { ChatService } from './chat.service';
import {
  ApplyFriendFormDto,
  AgreeFriendApplicationDto,
  RequestChatRecordDto,
} from './dto/chat.dto';

import { ValidationPipe } from '@/pipe/validation.pipe';

@ApiBearerAuth()
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: '好友申请' })
  @ApiBody({
    description: '好友申请',
    type: ApplyFriendFormDto,
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  @Post('apply')
  async applyNewFirend(
    @Body() applyDto: ApplyFriendFormDto,
    @Token() token: string,
  ) {
    return await this.chatService.applyNewFriend(applyDto, token);
  }

  @ApiOperation({ summary: '通过好友申请验证' })
  @ApiBody({
    description: '通过好友申请验证',
    type: AgreeFriendApplicationDto,
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  @Post('apply/pass')
  async agreeApplication(@Body() dataDto: AgreeFriendApplicationDto) {
    return await this.chatService.agreeFirendAppliaction(dataDto);
  }

  @ApiOperation({ summary: '获取联系人列表' })
  @UseGuards(AuthGuard('jwt'))
  @Get('contacts')
  async getContacts(@User() user: UserTokenSign) {
    return await this.chatService.getContactList(user.uid);
  }

  @ApiOperation({ summary: '获取指定联系人的聊天记录' })
  @ApiBody({ description: '获取聊天记录', type: RequestChatRecordDto })
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  @Post('record')
  async getChatRecord(
    @Body() data: RequestChatRecordDto,
    @User() user: UserTokenSign,
  ) {
    return await this.chatService.getChatRoomChatRecord(data, user.uid);
  }

  @ApiOperation({ summary: '获取联系人分组列表' })
  @UseGuards(AuthGuard('jwt'))
  @Get('contact-groups')
  async getContactGroups(@User() user: UserTokenSign) {
    return await this.chatService.getContectGroups(user.uid);
  }
}
