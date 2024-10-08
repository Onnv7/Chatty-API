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
  MessageChainData,
  MessageData,
  ReactMessageData,
  ReactMessageRequest,
  SendMessageData,
  SendMessageRequest,
} from '../../../../../libs/shared/src/types/chat';
import {
  AppError,
  ErrorResponseData,
  KAFKA_SEND_MESSAGE_TOPIC,
  KAFKA_SEND_REACTION_TOPIC,
  NOTIFICATION_SERVICE_CLIENT_KAFKA,
  PROFILE_SERVICE,
} from '../../../../../libs/shared/src';
import { Message } from '../../database/schema/message.schema';
import { ProfileServiceClient } from '../../../../../libs/shared/src/types/user';
import { lastValueFrom } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import {
  SendNewMessageData,
  SendReactionData,
} from '../../../../../libs/shared/src/types/kafka/notification';

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
    const messageListData: MessageChainData[] = [];
    const messagePage = await this.messageRepository.getMessagePage(
      body.conversationId,
      body.page,
      body.size,
    );
    const messageList = messagePage.messageList;

    if (messageList.length === 0) {
      return { totalPage: messagePage.totalPage, messageList: [] };
    }
    let prevSender = -1;
    messageList.reverse();
    messageList.forEach((msg, index) => {
      const uniqueReactions: string[] = Array.from(
        new Set(msg.reaction.map((react) => react.reaction)),
      ).slice(0, 3);

      const currentSenderId = msg.senderId;
      const element: MessageData = {
        id: msg.id,
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
        reactionList: uniqueReactions ?? [],
        reactedCount: msg.reaction.length,
      };
      if (currentSenderId === prevSender) {
        const lastChain: MessageChainData =
          messageListData[messageListData.length - 1];
        lastChain.messageChain.push(element);
      } else {
        prevSender = msg.senderId;
        messageListData.push({
          senderId: msg.senderId,
          messageChain: [element],
        });
      }
    });

    return { totalPage: messagePage.totalPage, messageList: messageListData };
  }

  async sendMessage(body: SendMessageRequest): Promise<SendMessageData> {
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
    const newMessage: Message = {
      senderId: body.senderId,
      content: body.content,
      conversationId: body.conversationId,
    };
    const msgData = await this.messageRepository.create(newMessage);

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
      id: msgData.id,
    };
  }
  async reactMessage(body: ReactMessageRequest): Promise<ReactMessageData> {
    const message = await this.messageRepository.getMessage(body.messageId);
    if (message) {
      const reacted = message.reaction.find(
        (react) =>
          react.actorId === body.senderId && react.reaction === body.reaction,
      );
      message.reaction = message.reaction.filter(
        (react) => react.actorId !== body.senderId,
      );
      if (!reacted)
        message.reaction.push({
          reaction: body.reaction,
          actorId: body.senderId,
        });
    }

    message.save();
    const conversation = await this.conversationRepository.getById(
      message.conversationId,
    );
    const receiverId = conversation.memberIdList.find(
      (memberId) => memberId !== body.senderId,
    );
    const uniqueReactions: string[] = Array.from(
      new Set(message.reaction.map((react) => react.reaction)),
    ).slice(0, 3);

    this.notificationClient.emit<any, SendReactionData>(
      KAFKA_SEND_REACTION_TOPIC,
      {
        senderId: body.senderId,
        receiverId: receiverId,
        reactionList: uniqueReactions,
        reactedCount: message.reaction.length,
        messageId: body.messageId,
        conversationId: message.conversationId,
      },
    );
    return {
      reactionList: uniqueReactions,
      reactedCount: message.reaction.length,
    };
  }
}
