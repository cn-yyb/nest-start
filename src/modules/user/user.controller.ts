import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  // 创建 UserController 控制器实例
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 创建 get 请求路由
  @Get('getUserList')
  getUserList() {
    return this.userService.getUserList();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('register')
  async register(@Body() userDto: RegisterUserDto) {
    return await this.userService.register(userDto);
  }

  @Get('findOne')
  findOne(@Body() body: { username: string }) {
    return this.userService.findOne(body.username);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const authRes = await this.authService.validateUser(
      body.username,
      body.password,
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
    } else {
    }
  }
}
