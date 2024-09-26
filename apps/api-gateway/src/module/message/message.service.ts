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
import { GetMessagePageResponsePayload } from './payload/message.response';
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

  async sendMessage(body: SendMessageRequestPayload) {
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
      const data = await lastValueFrom(
        this.messageServiceClient.sendMessage({
          content: body.content,
          conversationId: conversationData.conversationId,
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
}
