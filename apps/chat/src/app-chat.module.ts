import { Global, Module } from '@nestjs/common';
import { AppChatController } from './app-chat.controller';
import { AppChatService } from './app-chat.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModule } from './module/conversation/conversation.module';
import { MessageModule } from './module/message/message.module';
import { ConversationRepository } from './database/repository/convervation.repository';
import { MessageRepository } from './database/repository/message.repository';
import {
  Conversation,
  ConversationSchema,
} from './database/schema/conversation.schema';
import { Message, MessageSchema } from './database/schema/message.schema';
import {
  PROFILE_SERVICE,
  SharedModule,
  SharedService,
  USER_SERVICE_CLIENT,
} from '../../../libs/shared/src';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  PROFILE_SERVICE_NAME,
  ProfileServiceClient,
  USER_PACKAGE_NAME,
} from '../../../libs/shared/src/types/user';
import {
  MessageChain,
  MessageChainSchema,
} from './database/schema/message-chain.schema';

const schemaList = [
  { name: Conversation.name, schema: ConversationSchema },
  { name: Message.name, schema: MessageSchema },
  // { name: MessageChain.name, schema: MessageChainSchema },
];

const repository = [ConversationRepository, MessageRepository]; //ConversationRepository, MessageRepository

@Global()
@Module({
  imports: [
    SharedModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: 'mongodb://root:112233@localhost:27027/chatty?authSource=admin',
      }),
      inject: [ConfigService],
    }),

    ClientsModule.registerAsync([
      {
        inject: [SharedService],
        name: USER_SERVICE_CLIENT,
        useFactory: (configService: SharedService) => {
          return {
            transport: Transport.GRPC,
            options: {
              url: configService.env.USER_SERVER_URL,
              package: USER_PACKAGE_NAME,
              protoPath: join(__dirname, '../user.proto'),
            },
          };
        },
      },
    ]),
    MongooseModule.forFeature(schemaList),
    ConversationModule,
    MessageModule,
  ],
  controllers: [AppChatController],
  providers: [
    AppChatService,
    ...repository,
    {
      provide: PROFILE_SERVICE,
      useFactory: (client: ClientGrpc) => {
        return client.getService<ProfileServiceClient>(PROFILE_SERVICE_NAME);
      },
      inject: [USER_SERVICE_CLIENT],
    },
  ],
  exports: [...repository, SharedModule, PROFILE_SERVICE],
})
export class AppChatModule {}
