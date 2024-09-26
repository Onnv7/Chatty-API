import { Global, Module, OnModuleInit } from '@nestjs/common';
import { AppAuthController } from './app-auth.controller';
import { AppAuthService } from './app-auth.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from './common/config/typeorm.config';
import { AccountEntity } from './data/entity/account.entity';
import { AccountRepository } from './data/repository/account.repository';
import JwtConfig from './common/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './module/auth/auth.module';
import {
  ClientGrpc,
  ClientKafka,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { AUTH_PACKAGE_NAME } from '../../../libs/shared/src/types/auth';
import {
  EMAIL_SERVICE,
  KAFKA_AUTH_CLIENT_ID,
  KAFKA_AUTH_GROUP_ID,
  KAFKA_NOTIFICATION_CLIENT_ID,
  KAFKA_NOTIFICATION_GROUP_ID,
  NOTIFICATION_SERVICE_CLIENT_KAFKA,
  PROFILE_SERVICE,
  USER_SERVICE_CLIENT,
} from '../../../libs/shared/src/constants/configuration.constant';
import {
  PROFILE_SERVICE_NAME,
  ProfileServiceClient,
  USER_PACKAGE_NAME,
} from '../../../libs/shared/src/types/user';
import { CreateAccountCommand } from './cqrs/command/auth/RegisterAccount/create-account/create-account.command';
import { SharedModule, SharedService } from '../../../libs/shared/src';
import { ConfigService } from '@nestjs/config';
import { EmailVerificationEntity } from './data/entity/email-verification.entity';
import { MailVerificationRepository } from './data/repository/mail-verification.repository';
import { Partitioners } from 'kafkajs';

const entityList = [AccountEntity, EmailVerificationEntity];
const repositoryList = [AccountRepository, MailVerificationRepository];
@Global()
@Module({
  imports: [
    SharedModule,
    CqrsModule,
    TypeOrmModule.forRootAsync(TypeOrmConfig.getTypeOrmConfig()),
    TypeOrmModule.forFeature(entityList),
    JwtModule.registerAsync(JwtConfig.getJwtConfig()),
    ClientsModule.registerAsync([
      {
        inject: [SharedService],
        name: USER_SERVICE_CLIENT,
        useFactory: (configService: SharedService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.env.USER_SERVER_URL,
            package: USER_PACKAGE_NAME,
            protoPath: join(__dirname, '../user.proto'),
          },
        }),
      },
      {
        name: NOTIFICATION_SERVICE_CLIENT_KAFKA,
        useFactory: (sharedService: SharedService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: KAFKA_AUTH_CLIENT_ID,
              brokers: [sharedService.env.KAFKA_BROKER],
            },
          },
        }),
        inject: [SharedService],
      },
    ]),
    AuthModule,
  ],

  controllers: [AppAuthController],
  providers: [
    AppAuthService,
    ...repositoryList,
    CreateAccountCommand,
    {
      provide: PROFILE_SERVICE,
      useFactory: (client: ClientGrpc) => {
        return client.getService<ProfileServiceClient>(PROFILE_SERVICE_NAME);
      },
      inject: [USER_SERVICE_CLIENT],
    },
    // {
    //   provide: EMAIL_SERVICE,
    //   useFactory: (client: ClientKafka) => {
    //     return client.createClient();
    //   },
    //   inject: [NOTIFICATION_SERVICE_CLIENT],
    // },
  ],
  exports: [
    ...repositoryList,
    CqrsModule,
    JwtModule,
    ClientsModule,
    CreateAccountCommand,
    PROFILE_SERVICE,
    SharedModule,
  ],
})
export class AppAuthModule implements OnModuleInit {
  onModuleInit() {}
}
