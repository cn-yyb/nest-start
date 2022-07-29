import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 8888;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => {
    console.log(`The server has been runing at http://127.0.0.1:${PORT}`);
  });
}
bootstrap();
