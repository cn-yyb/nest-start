import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 8888;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // todo 设置全局路由前缀
  // app.setGlobalPrefix('api/v1');
  await app.listen(PORT, () => {
    console.log(`The server has been runing at http://127.0.0.1:${PORT}`);
  });
}
bootstrap();
