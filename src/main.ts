import * as cookieParser from 'cookie-parser';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Trackr')
    .setDescription('The Trackr API description')
    .setVersion('0.1')
    .addCookieAuth('access_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      withCredentials: true,
    },
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
