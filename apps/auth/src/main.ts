import { NestFactory } from '@nestjs/core';
import { AppAuthModule } from './app-auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  MicroAppExceptionHandlerFilter,
  MicroExceptionHandlerFilter,
  SharedService,
} from '../../../libs/shared/src';
import { AUTH_PACKAGE_NAME } from '../../../libs/shared/src/types/auth';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppAuthModule);
  const sharedService = appContext.get(SharedService);

  const app = await NestFactory.createMicroservice(
    AppAuthModule,
    sharedService.getGRPCConfigServer(
      AUTH_PACKAGE_NAME,
      join(__dirname, '../auth.proto'),
      sharedService.env.AUTH_SERVER_URL,
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
