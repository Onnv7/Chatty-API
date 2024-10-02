import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { MessageRepository } from '../../database/repository/message.repository';
import { ConversationRepository } from '../../database/repository/convervation.repository';
import {
  GetMessageData,
  GetMessageRequest,
  SendMessageData,
  SendMessageRequest,
} from '../../../../../libs/shared/src/types/chat';
import {
  AppError,
  ErrorResponseData,
  KAFKA_SEND_MESSAGE_TOPIC,
  NOTIFICATION_SERVICE_CLIENT_KAFKA,
  PROFILE_SERVICE,
} from '../../../../../libs/shared/src';
import { Message } from '../../database/schema/message.schema';
import { ProfileServiceClient } from '../../../../../libs/shared/src/types/user';
import { lastValueFrom } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import { SendNewMessageData } from '../../../../../libs/shared/src/types/kafka/notification';

@Injectable()
export class MessageService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    @Inject(PROFILE_SERVICE)
    private readonly profileServiceClient: ProfileServiceClient,

    @Inject(NOTIFICATION_SERVICE_CLIENT_KAFKA)
    private readonly notificationClient: ClientKafka,
  ) {}

  async onApplicationShutdown(signal?: string) {
    await this.notificationClient.close();
  }
  async onModuleInit() {
    await this.notificationClient.connect();
  }

  async getMessagePage(body: GetMessageRequest): Promise<GetMessageData> {
    const messagePage = await this.messageRepository.getMessagePage(
      body.conversationId,
      body.page,
      body.size,
    );
    const messageList = await Promise.all(
      messagePage.messageList?.map(async (message) => {
        const { success, data, error } = await lastValueFrom(
          this.profileServiceClient.getProfileById({
            id: message.senderId,
          }),
        );
        if (!success) {
          throw new AppError(error);
        }

        return {
          messageChain: message.messageChain.map((msg) => {
            return {
              content: msg.content,
              createdAt: msg.createdAt.toISOString(),
              id: msg._id,
            };
          }),
          senderId: message.senderId,
        };
      }),
    );
    return { totalPage: messagePage.totalPage, messageList: messageList };
  }

  async sendMessage(body: SendMessageRequest): Promise<SendMessageData> {
    let messageId;
    const conversation = await this.conversationRepository.getById(
      body.conversationId,
    );
    if (!conversation) {
      throw new AppError(ErrorResponseData.CONVERSATION_NOT_FOUND);
    } else if (
      !conversation.memberIdList.find((msg) => msg === body.senderId)
    ) {
      throw new AppError(ErrorResponseData.CONVERSATION_NOT_FOUND);
    }

    if (conversation.senderId && conversation.senderId === body.senderId) {
      const lastMessage = await this.messageRepository.getLastMessage(
        body.conversationId,
      );

      lastMessage.messageChain.push({ content: body.content });
      messageId = lastMessage.messageChain.reverse()[0]._id;
      await lastMessage.save();
    } else {
      const newMessage: Message = {
        messageChain: [{ content: body.content }],
        senderId: body.senderId,
        conversationId: body.conversationId,
      };
      const newMsg = await this.messageRepository.create(newMessage);
      messageId = newMsg.messageChain[0]._id;
    }
    const receiverId = conversation.memberIdList.find(
      (memberId) => memberId !== body.senderId,
    );
    const data = {
      senderId: body.senderId,
      receiverId: receiverId,
      content: body.content,
      conversationId: body.conversationId,
      createdAt: new Date().toISOString(),
    };

    this.notificationClient.emit<any, SendNewMessageData>(
      KAFKA_SEND_MESSAGE_TOPIC,
      data,
    );
    conversation.lastMessage = body.content;

    conversation.senderId = body.senderId;
    await conversation.save();
    conversation.lastMessage;
    return {
      id: messageId,
    };
  }
}
