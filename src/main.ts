import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filter/any-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { logger } from './middleware/logger.middleware';
// swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PORT, ROUTE_PREFIX } from './constants/server.content';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 开启跨域访问
  app.enableCors({ origin: '*', credentials: true });
  // todo 设置全局路由前缀
  app.setGlobalPrefix(ROUTE_PREFIX);
  // 解析处理 json & 表单数据
  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  //  请求日志打印
  app.use(logger);
  // 全局拦截器拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全部异常捕获过滤器
  app.useGlobalFilters(new AllExceptionsFilter());
  // 过滤处理 HTTP 异常
  app.useGlobalFilters(new HttpExceptionFilter());

  // 配置 Swagger
  const options = new DocumentBuilder()
    .addBearerAuth() // 开启 BearerAuth 授权认证
    .setTitle('Nest 接口文档')
    .setDescription('The nest-zero-to-one API description')
    .setVersion('1.0')
    .addTag('test')
    .build();

  SwaggerModule.setup(
    'api-doc',
    app,
    SwaggerModule.createDocument(app, options),
  );

  // server start
  await app.listen(PORT, () => {
    Logger.log('==========================================================');
    Logger.log(
      `The server has been runing at http://127.0.0.1:${PORT}`,
      'server',
    );
    Logger.log(`http://127.0.0.1:${PORT}/api-doc`, 'api-doc');
    Logger.log(
      `http://127.0.0.1:${PORT}/${ROUTE_PREFIX}/status`,
      'status-monitor',
    );
    Logger.log('==========================================================');
  });
}
bootstrap();
