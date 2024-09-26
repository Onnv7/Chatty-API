import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { ProfileModule } from './module/profile/profile.module';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AUTH_PACKAGE_NAME } from '../../../libs/shared/src/types/auth';
import {
  AUTH_SERVICE_CLIENT,
  MESSAGE_SERVICE,
  CHAT_SERVICE_CLIENT,
  PROFILE_SERVICE,
  USER_SERVICE_CLIENT,
  CONVERSATION_SERVICE,
  FRIEND_SERVICE,
} from '../../../libs/shared/src/constants/configuration.constant';
import { ConversationModule } from './module/conversation/conversation.module';
import {
  CHAT_PACKAGE_NAME,
  CONVERSATION_SERVICE_NAME,
  ConversationServiceClient,
  MESSAGE_SERVICE_NAME,
  MessageServiceClient,
} from '../../../libs/shared/src/types/chat';
import { MessageModule } from './module/message/message.module';
import {
  FRIEND_SERVICE_NAME,
  PROFILE_SERVICE_NAME,
  ProfileServiceClient,
  USER_PACKAGE_NAME,
} from '../../../libs/shared/src/types/user';
import { SharedModule, SharedService } from '../../../libs/shared/src';
import { AuthContextService } from './libs/auth-context.service';
import { FriendModule } from './module/friend/friend.module';

@Global()
@Module({
  imports: [
    AuthModule,
    ProfileModule,
    SharedModule,
    ClientsModule.registerAsync([
      {
        inject: [SharedService],
        name: AUTH_SERVICE_CLIENT,
        useFactory: (sharedService: SharedService) => ({
          transport: Transport.GRPC,
          options: {
            url: sharedService.env.AUTH_SERVER_URL,
            package: AUTH_PACKAGE_NAME,
            protoPath: join(__dirname, '../auth.proto'),
          },
        }),
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
      {
        inject: [SharedService],
        name: USER_SERVICE_CLIENT,
        useFactory: (sharedService: SharedService) => ({
          transport: Transport.GRPC,
          options: {
            url: sharedService.env.USER_SERVER_URL,
            package: USER_PACKAGE_NAME,
            protoPath: join(__dirname, '../user.proto'),
          },
        }),
      },
    ]),
    ConversationModule,
    MessageModule,
    FriendModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: PROFILE_SERVICE,
      useFactory: (client: ClientGrpc) => {
        return client.getService<ProfileServiceClient>(PROFILE_SERVICE_NAME);
      },
      inject: [USER_SERVICE_CLIENT],
    },
    {
      provide: FRIEND_SERVICE,
      useFactory: (client: ClientGrpc) => {
        return client.getService<ProfileServiceClient>(FRIEND_SERVICE_NAME);
      },
      inject: [USER_SERVICE_CLIENT],
    },
    {
      provide: MESSAGE_SERVICE,
      useFactory: (client: ClientGrpc) => {
        return client.getService<MessageServiceClient>(MESSAGE_SERVICE_NAME);
      },
      inject: [CHAT_SERVICE_CLIENT],
    },
    {
      provide: CONVERSATION_SERVICE,
      useFactory: (client: ClientGrpc) => {
        return client.getService<ConversationServiceClient>(
          CONVERSATION_SERVICE_NAME,
        );
      },
      inject: [CHAT_SERVICE_CLIENT],
    },
    AuthContextService,
  ],
  exports: [
    ClientsModule,
    SharedModule,
    MESSAGE_SERVICE,
    CONVERSATION_SERVICE,
    PROFILE_SERVICE,
    FRIEND_SERVICE,
    AuthContextService,
  ],
})
export class AppModule {}
