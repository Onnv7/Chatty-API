import { NestFactory } from '@nestjs/core';
import { AppUserModule } from './app-user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  MicroExceptionHandlerFilter,
  MicroAppExceptionHandlerFilter,
  SharedService,
  KAFKA_USER_SERVER_CLIENT_ID,
  KAFKA_USER_SERVER_GROUP_ID,
} from '../../../libs/shared/src';
import { USER_PACKAGE_NAME } from '../../../libs/shared/src/types/user';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppUserModule);
  const sharedService = appContext.get(SharedService);

  const grpcApp = await NestFactory.createMicroservice(
    AppUserModule,
    sharedService.getGRPCServerConfig(
      USER_PACKAGE_NAME,
      join(__dirname, '../user.proto'),
      sharedService.env.USER_SERVER_URL,
    ),
  );
  const kafkaApp = await NestFactory.createMicroservice(
    AppUserModule,
    sharedService.getKafkaConfigServer(
      KAFKA_USER_SERVER_CLIENT_ID,
      KAFKA_USER_SERVER_GROUP_ID,
      [sharedService.env.KAFKA_BROKER],
    ),
  );
  grpcApp.useGlobalFilters(
    new MicroExceptionHandlerFilter(),
    new MicroAppExceptionHandlerFilter(),
  );
  kafkaApp.useGlobalFilters(
    new MicroExceptionHandlerFilter(),
    new MicroAppExceptionHandlerFilter(),
  );
  await Promise.all([grpcApp.listen(), kafkaApp.listen()]);
  await appContext.close();
}
bootstrap();
