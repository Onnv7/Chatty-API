import { NestFactory } from '@nestjs/core';
import { AppNotificationModule } from './app-notification.module';
import { SharedService } from '../../../libs/shared/src/shared.service';
import {
  MicroExceptionHandlerFilter,
  MicroAppExceptionHandlerFilter,
} from '../../../libs/shared/src';
import { AppChatModule } from '../../chat/src/app-chat.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppChatModule);
  const sharedService = appContext.get(SharedService);

  const app = await NestFactory.createMicroservice(
    AppNotificationModule,
    sharedService.getKafkaConfigServer([sharedService.env.KAFKA_BROKER]),
  );

  app.useGlobalFilters(
    new MicroExceptionHandlerFilter(),
    new MicroAppExceptionHandlerFilter(),
  );

  await app.listen();
  await appContext.close();
}
bootstrap();
