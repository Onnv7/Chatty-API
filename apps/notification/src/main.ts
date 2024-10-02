import { NestFactory } from '@nestjs/core';
import { AppNotificationModule } from './app-notification.module';
import { SharedService } from '../../../libs/shared/src/shared.service';
import {
  MicroExceptionHandlerFilter,
  MicroAppExceptionHandlerFilter,
  WebSocketExceptionFilter,
  KAFKA_NOTIFICATION_SERVER_CLIENT_ID,
  KAFKA_NOTIFICATION_SERVER_GROUP_ID,
} from '../../../libs/shared/src';
import { AppChatModule } from '../../chat/src/app-chat.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppChatModule);
  const sharedService = appContext.get(SharedService);

  const app = await NestFactory.createMicroservice(
    AppNotificationModule,
    sharedService.getKafkaConfigServer(
      KAFKA_NOTIFICATION_SERVER_CLIENT_ID,
      KAFKA_NOTIFICATION_SERVER_GROUP_ID,
      [sharedService.env.KAFKA_BROKER],
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(
    new MicroExceptionHandlerFilter(),
    new MicroAppExceptionHandlerFilter(),
    new WebSocketExceptionFilter(),
  );

  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen();
  await appContext.close();
}
bootstrap();
