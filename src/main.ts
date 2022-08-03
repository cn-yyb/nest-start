import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filter/any-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { logger } from './middleware/logger.middleware';

const PORT = 8888;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 解析处理 json & 表单数据
  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  //  请求日志打印
  app.use(logger);
  // 全局拦截器拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // todo 设置全局路由前缀
  // app.setGlobalPrefix('api/v1');
  // 全部异常捕获过滤器
  app.useGlobalFilters(new AllExceptionsFilter());
  // 过滤处理 HTTP 异常
  app.useGlobalFilters(new HttpExceptionFilter());

  // server start
  await app.listen(PORT, () => {
    console.log(`The server has been runing at http://127.0.0.1:${PORT}`);
  });
}
bootstrap();
