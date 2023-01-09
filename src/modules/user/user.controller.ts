import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  LoginDto,
  UserRegisterDto,
  UploadFileDto,
  GetUserInfoDto,
} from './dto/user.dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ValidationPipe } from '@/pipe/validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BASE_PATH } from '@/constants/server.contants';
import * as dayjs from 'dayjs';
import { WsGateway } from '@/events/ws/ws.gateway';

@ApiBearerAuth() // Swagger 的 JWT 验证
@ApiTags('user') // 添加 接口标签 装饰器
@Controller('user')
export class UserController {
  // 创建 UserController 控制器实例
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly wsGateway: WsGateway,
  ) {}

  @ApiOperation({ summary: '用户注册' })
  @ApiBody({
    description: '用户注册',
    type: UserRegisterDto,
  })
  @UsePipes(new ValidationPipe()) // 使用管道验证
  @Post('register')
  async register(@Body() userDto: UserRegisterDto) {
    return await this.userService.register(userDto);
  }

  @ApiOperation({ summary: '用户登录' })
  @ApiBody({
    description: '用户登录',
    type: LoginDto,
  })
  @UsePipes(new ValidationPipe()) // 使用管道验证
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const authRes = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (authRes) {
      switch (authRes.code) {
        case 0:
          return this.authService.certificate(authRes.user);
        case 1:
          return {
            code: 1,
            msg: '账号或密码错误！',
          };

        default:
          return {
            code: 2,
            msg: '该用户未注册！',
          };
      }
    }
  }

  @ApiOperation({ summary: '获取用户信息' })
  @ApiBody({
    description: '优先级 uid > username > userId',
    type: GetUserInfoDto,
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  @Post('getUserInfo')
  getUserInfo(@Body() body: GetUserInfoDto) {
    return this.userService.getUserSelfInfo(body);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '通用单文件上传',
    type: UploadFileDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `./upload/${dayjs().format('YYYYMMDD')}`,
        filename: (_req, file, cb) => {
          // console.log(req, file);
          cb(null, `${Date.now()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('upload')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      code: 0,
      msg: 'ok',
      data: {
        originalName: file.originalname,
        fileUrl: `${BASE_PATH}/${file.path.replace(/\\/g, '/')}`,
        filePath: `/${file.path.replace(/\\/g, '/')}`,
        uploadDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
    };
  }
}
