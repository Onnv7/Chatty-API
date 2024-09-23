import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import {
  ExceptionHandlerFilter,
  AppExceptionHandlerFilter,
} from './common/filter/exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const filters = [
    new ExceptionHandlerFilter(),
    new AppExceptionHandlerFilter(),
  ];

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Bật chế độ chuyển đổi
      whitelist: true, // Chỉ cho phép các thuộc tính đã được định nghĩa trong DTO
    }),
  );

  app.useGlobalFilters(...filters);
  // app.connectMicroservice()
  // set interceptor
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    // new GrpcErrorInterceptor(),
  );

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Chatty API')
    .setDescription('')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .addCookieAuth(
      'refreshToken',
      {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
      },
      'refresh-token',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port: number = Number(process.env.PORT) || 8000;
  await app.startAllMicroservices();
  await app
    .listen(port)
    .then(() =>
      console.log(
        'Server is running on port ' + port,
        `http://localhost:${port}/swagger`,
      ),
    );
}
bootstrap();
