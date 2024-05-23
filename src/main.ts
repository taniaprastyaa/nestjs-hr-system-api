import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new BadRequestExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    })
  );

  app.enableCors();
  
  const config = new DocumentBuilder()
  .setTitle('HR System API Documentation')
  .setDescription('This is the API documentation for HR System')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  await app.listen(3000);
}
bootstrap();
