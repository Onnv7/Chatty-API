import { Inject, Injectable } from '@nestjs/common';
import {
  CHAT_SERVICE_CLIENT,
  CONVERSATION_SERVICE,
  MESSAGE_SERVICE,
} from '../../../../../libs/shared/src/constants/configuration.constant';
import {
  ConversationServiceClient,
  MessageServiceClient,
} from '../../../../../libs/shared/src/types/chat';
import { SendMessageRequestPayload } from './payload/message.request';
import { lastValueFrom } from 'rxjs';
import { AppError } from '../../../../../libs/shared/src';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGE_SERVICE)
    private readonly messageServiceClient: MessageServiceClient,
    @Inject(CONVERSATION_SERVICE)
    private readonly conversationClient: ConversationServiceClient,
  ) {}

  async sendMessage(body: SendMessageRequestPayload) {
    if (body.memberIdList) {
      const {
        success,
        error,
        data: { conversationId },
      } = await lastValueFrom(
        this.conversationClient.createConversation({
          memberIdList: body.memberIdList,
        }),
      );
      if (!success) throw new AppError(error);
      const data = await lastValueFrom(
        this.messageServiceClient.sendMessage({
          content: body.content,
          conversationId: conversationId,
          senderId: body.senderId,
        }),
      );
      return;
    }
    const data = await lastValueFrom(
      this.messageServiceClient.sendMessage({
        content: body.content,
        conversationId: body.conversationId,
        senderId: body.senderId,
      }),
    );
  }
}
