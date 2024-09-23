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
import { SharedModule, SharedService } from '../../../libs/shared/src';

const schemaList = [
  { name: Conversation.name, schema: ConversationSchema },
  { name: Message.name, schema: MessageSchema },
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
    MongooseModule.forFeature(schemaList),
    ConversationModule,
    MessageModule,
  ],
  controllers: [AppChatController],
  providers: [AppChatService, ...repository],
  exports: [...repository],
})
export class AppChatModule {}
