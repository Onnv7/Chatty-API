import { NestFactory } from '@nestjs/core';
import { AppUserModule } from './app-user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  MicroExceptionHandlerFilter,
  MicroAppExceptionHandlerFilter,
  SharedService,
} from '../../../libs/shared/src';
import { USER_PACKAGE_NAME } from '../../../libs/shared/src/types/user';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppUserModule);
  const sharedService = appContext.get(SharedService);
  console.log('🚀 ~ bootstrap ~ sharedService:', sharedService.env);

  const app = await NestFactory.createMicroservice(
    AppUserModule,
    sharedService.getGRPCConfigServer(
      USER_PACKAGE_NAME,
      join(__dirname, '../user.proto'),
      sharedService.env.USER_SERVER_URL,
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
