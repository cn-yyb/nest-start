import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ApplyFriendFormDto, AgreeFriendApplicationDto } from './dto/chat.dto';

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
  @UsePipes(new ValidationPipe()) // 使用管道验证
  @Post('apply')
  async applyNewFirend(@Body() applyDto: ApplyFriendFormDto) {
    return await this.chatService.applyNewFriend(applyDto);
  }

  @ApiOperation({ summary: '通过好友申请验证' })
  @ApiBody({
    description: '通过好友申请验证',
    type: AgreeFriendApplicationDto,
  })
  @UsePipes(new ValidationPipe()) // 使用管道验证
  @Post('apply/pass')
  async agreeApplication(@Body() dataDto: AgreeFriendApplicationDto) {
    return await this.chatService.agreeFirendAppliaction(dataDto);
  }
}
