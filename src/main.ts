import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const config= new DocumentBuilder()
  .setTitle('LittleStep API')
  .setDescription('Api documentation for LittleStep API')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      description: 'Provide JWT access token'
    },
    'authBearer',
  )
  .build();

  const documentFactory = () => SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api/docs',app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
