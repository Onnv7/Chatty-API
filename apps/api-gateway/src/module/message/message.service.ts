import { Inject, Injectable } from '@nestjs/common';
import {
  CHAT_SERVICE_CLIENT,
  CONVERSATION_SERVICE,
  MESSAGE_SERVICE,
} from '../../../../../libs/shared/src/constants/configuration.constant';
import {
  ConversationServiceClient,
  MessageServiceClient,
  SendMessageResponse,
} from '../../../../../libs/shared/src/types/chat';
import {
  ReactMessageRequestPayload,
  SendMessageRequestPayload,
} from './payload/message.request';
import { lastValueFrom } from 'rxjs';
import { AppError } from '../../../../../libs/shared/src';
import {
  GetMessagePageResponsePayload,
  ReactMessageResponsePayload,
  SendMessageResponsePayload,
} from './payload/message.response';
import { AuthContextService } from '../../libs/auth-context.service';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGE_SERVICE)
    private readonly messageServiceClient: MessageServiceClient,
    @Inject(CONVERSATION_SERVICE)
    private readonly conversationClient: ConversationServiceClient,
    private readonly authContextService: AuthContextService,
  ) {}

  async sendMessage(
    body: SendMessageRequestPayload,
  ): Promise<SendMessageResponsePayload> {
    let data: SendMessageResponse;
    if (body.memberIdList) {
      const {
        success,
        error,
        data: conversationData,
      } = await lastValueFrom(
        this.conversationClient.createConversation({
          memberIdList: body.memberIdList,
          creatorId: this.authContextService.getUser().id,
        }),
      );

      if (!success) throw new AppError(error);
      data = await lastValueFrom(
        this.messageServiceClient.sendMessage({
          content: body.content,
          conversationId: conversationData.conversationId,
          senderId: body.senderId,
        }),
      );
      return { id: conversationData.conversationId };
    }
    data = await lastValueFrom(
      this.messageServiceClient.sendMessage({
        content: body.content,
        conversationId: body.conversationId,
        senderId: body.senderId,
      }),
    );

    if (!data.success) throw new AppError(data.error);
    return data.data;
  }

  async getMessagePage(
    conversationId: string,
    page: number,
    size: number,
  ): Promise<GetMessagePageResponsePayload> {
    const { success, error, data } = await lastValueFrom(
      this.messageServiceClient.getMessagePage({
        conversationId: conversationId,
        page: page,
        size: size,
      }),
    );

    if (!success) throw new AppError(error);
    return data;
  }

  async reactMessage(
    body: ReactMessageRequestPayload,
  ): Promise<ReactMessageResponsePayload> {
    const { success, error, data } = await lastValueFrom(
      this.messageServiceClient.reactMessage({
        senderId: body.senderId,
        reaction: body.reaction,
        messageId: body.messageId,
      }),
    );

    if (!success) throw new AppError(error);
    return data;
  }
}
