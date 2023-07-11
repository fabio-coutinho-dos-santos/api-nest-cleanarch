import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ApiPrefix } from './constant/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Payever API')
    .setDescription('')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${ApiPrefix.Version}/doc`, app, document);
  app.useGlobalPipes(new ValidationPipe());
  const port = parseInt(process.env.SERVER_PORT);
  await app.listen(port);
}
bootstrap();
