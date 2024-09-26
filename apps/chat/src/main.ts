import { NestFactory } from '@nestjs/core';
import { AppChatModule } from './app-chat.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  MicroExceptionHandlerFilter,
  MicroAppExceptionHandlerFilter,
  SharedService,
} from '../../../libs/shared/src';
import { CHAT_PACKAGE_NAME } from '../../../libs/shared/src/types/chat';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppChatModule);
  const sharedService = appContext.get(SharedService);

  const app = await NestFactory.createMicroservice(
    AppChatModule,
    sharedService.getGRPCServerConfig(
      CHAT_PACKAGE_NAME,
      join(__dirname, '../chat.proto'),
      sharedService.env.CHAT_SERVER_URL,
    ),
  );
  app.useGlobalFilters(
    new MicroExceptionHandlerFilter(),
    new MicroAppExceptionHandlerFilter(),
  );

  await app.listen();
  await appContext.close();
}
bootstrap();
