import { Inject, Injectable } from '@nestjs/common';
import { MessageRepository } from '../../database/repository/message.repository';
import { ConversationRepository } from '../../database/repository/convervation.repository';
import {
  GetMessageData,
  GetMessageRequest,
  SendMessageRequest,
} from '../../../../../libs/shared/src/types/chat';
import {
  AppError,
  ErrorResponseData,
  PROFILE_SERVICE,
} from '../../../../../libs/shared/src';
import { Message } from '../../database/schema/message.schema';
import { ProfileServiceClient } from '../../../../../libs/shared/src/types/user';
import { lastValueFrom } from 'rxjs';
import { MessageChainData } from '../../../../api-gateway/src/module/message/payload/message.response';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    @Inject(PROFILE_SERVICE)
    private readonly profileServiceClient: ProfileServiceClient,
  ) {}
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
            };
          }),
          senderId: message.senderId,
          avatarUrl: data.avatarUrl,
        };
      }),
    );
    return { totalPage: messagePage.totalPage, messageList: messageList };
  }

  async sendMessage(body: SendMessageRequest) {
    if (body.conversationId) {
    }
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
      await lastMessage.save();
    } else {
      const newMessage: Message = {
        messageChain: [{ content: body.content }],
        senderId: body.senderId,
        conversationId: body.conversationId,
      };
      await this.messageRepository.create(newMessage);
    }

    conversation.lastMessage = body.content;
    conversation.senderId = body.senderId;
    await conversation.save();
  }
}
