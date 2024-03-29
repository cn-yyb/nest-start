import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { AnyExceptionFilter } from './filter/any-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { logger } from './middleware/logger.middleware';
// swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PORT, ROUTE_PREFIX } from './constants/server.contants';
import { Logger, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import { WsAdapter } from './events/ws/ws.adapter';
import { config as dotenvConfig } from 'dotenv';

// safe
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

function initDotenvConfig() {
  // 默认加载 .env 文件
  dotenvConfig();
  // 加载指定模式下的配置 env 文件, 覆盖默认参数
  const configRecord = dotenvConfig({
    path: resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
    override: true, // 开启重写
  }).parsed;

  if (!configRecord) {
    Logger.error('项目配置文件不存在!', 'env');
    // exit
    process.exit(1);
  }
}
initDotenvConfig();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 配置 ws 服务适配器
  app.useWebSocketAdapter(new WsAdapter(app));

  // 开启跨域访问
  app.enableCors({ origin: '*', credentials: true });
  // todo 设置全局路由前缀
  app.setGlobalPrefix(ROUTE_PREFIX);
  // 声明全局接口版本
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  // });
  // 解析处理 json & 表单数据
  app.use(json()); // For parsing application/json
  app.use(urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  //  请求日志打印
  app.use(logger);
  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全部异常捕获过滤器
  app.useGlobalFilters(new AnyExceptionFilter());
  // 过滤处理 HTTP 异常
  app.useGlobalFilters(new HttpExceptionFilter());
  // 配置静态资源目录
  app.useStaticAssets(join(__dirname, '..', 'upload'), {
    prefix: '/upload',
  });

  // 防范 xss 攻击
  app.use(helmet());
  // 高频请求限速处理
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      message: {
        code: 429,
        msg: 'Too many requestions created from this IP, please try again after 15 monutes',
      },
    }),
  );

  // 设置默认模板引擎
  app.setViewEngine('ejs');

  // 配置 Swagger
  const options = new DocumentBuilder()
    .addBearerAuth() // 开启 BearerAuth 授权认证
    .setTitle('Nest 接口文档')
    .setDescription(
      `Base Url: <a href="http://127.0.0.1:${PORT}/api-doc">http://127.0.0.1:${PORT}/api/v1/</a>`,
    )
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
