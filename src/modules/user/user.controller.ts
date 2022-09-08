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
import { LoginDto, RegisterUserDto, UploadFileDto } from './dto/user.dto';
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
import * as path from 'path';
import * as moment from 'moment';
import { BASE_PATH } from '@/constants/server.content';

@ApiBearerAuth() // Swagger 的 JWT 验证
@ApiTags('user') // 添加 接口标签 装饰器
@Controller('user')
export class UserController {
  // 创建 UserController 控制器实例
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 创建 get 请求路由
  @UseGuards(AuthGuard('jwt'))
  @Get('getUserList')
  // @HttpCode(403)
  getUserList() {
    // @Res() res: Response

    // 手动变更状态码
    // res.status(HttpStatus.FORBIDDEN);
    // return this.userService.getUserList();

    // 方式二 （抛异常）
    return this.userService.getUserList();
  }

  @ApiOperation({ summary: '用户注册' })
  @ApiBody({
    description: '用户注册',
    type: RegisterUserDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  @Post('register')
  async register(@Body() userDto: RegisterUserDto) {
    return await this.userService.register(userDto);
  }

  @Get('findOne')
  findOne(@Body() body: { username: string }) {
    return this.userService.findOne(body.username);
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
        case 1:
          return this.authService.certificate(authRes.user);
        case 2:
          return {
            code: 2,
            msg: '账号或密码错误！',
          };

        default:
          return {
            code: 0,
            msg: '该用户未注册！',
          };
      }
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '通用单文件上传',
    type: UploadFileDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `./upload/${moment().format('YYYYMMDD')}`,
        filename: (_req, file, cb) => {
          // console.log(req, file);
          cb(null, `${Date.now()}${path.extname(file.originalname)}`);
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
        originalname: file.originalname,
        fileUrl: `${BASE_PATH}/${file.path.replace(/\\/g, '/')}`,
      },
    };
  }
}
