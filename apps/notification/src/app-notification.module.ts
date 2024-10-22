import { Global, Module } from '@nestjs/common';
import { AppNotificationService } from './app-notification.service';
import { AppNotificationController } from './app-notification.controller';
import { MailModule } from './module/mail/mail.module';
import { MailerModule } from '@nest-modules/mailer';
import MailerConfig from './common/config/mailer.config';
import {
  CHAT_SERVICE_CLIENT,
  CONVERSATION_SERVICE,
  KAFKA_CONVERSATION_CLIENT_ID,
  KAFKA_NOTIFICATION_CLIENT_ID,
  NOTIFICATION_SERVICE_CLIENT_KAFKA,
  SharedModule,
  SharedService,
  USER_SERVICE_CLIENT_KAFKA,
} from '../../../libs/shared/src';
import { ConversationModule } from './module/conversation/conversation.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import RedisConfig from './common/config/redis.config';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { UserModule } from './module/user/user.module';
import { join } from 'path';
import {
  CHAT_PACKAGE_NAME,
  CONVERSATION_SERVICE_NAME,
  ConversationServiceClient,
} from '../../../libs/shared/src/types/chat';

@Global()
@Module({
  imports: [
    ConversationModule,
    UserModule,
    MailModule,
    SharedModule,
    MailerModule.forRootAsync(MailerConfig.getMailerAsyncOptions()),
    RedisModule.forRootAsync({
      inject: [SharedService],
      useFactory: (sharedService: SharedService) =>
        RedisConfig.getConfig(sharedService),
    }),
    ClientsModule.registerAsync([
      {
        name: USER_SERVICE_CLIENT_KAFKA,
        useFactory: (sharedService: SharedService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: KAFKA_NOTIFICATION_CLIENT_ID,
              brokers: [sharedService.env.KAFKA_BROKER],
            },
          },
        }),
        inject: [SharedService],
      },
      {
        inject: [SharedService],
        name: CHAT_SERVICE_CLIENT,
        useFactory: (sharedService: SharedService) => ({
          transport: Transport.GRPC,
          options: {
            url: sharedService.env.CHAT_SERVER_URL,
            package: CHAT_PACKAGE_NAME,
            protoPath: join(__dirname, '../chat.proto'),
          },
        }),
      },
    ]),
  ],
  controllers: [AppNotificationController],
  providers: [
    AppNotificationService,
    {
      provide: CONVERSATION_SERVICE,
      useFactory: (client: ClientGrpc) => {
        return client.getService<ConversationServiceClient>(
          CONVERSATION_SERVICE_NAME,
        );
      },
      inject: [CHAT_SERVICE_CLIENT],
    },
  ],
  exports: [SharedModule, RedisModule, ClientsModule, CONVERSATION_SERVICE],
})
export class AppNotificationModule {}
