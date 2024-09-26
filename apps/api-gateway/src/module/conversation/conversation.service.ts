import { Inject, Injectable } from '@nestjs/common';
import { CONVERSATION_SERVICE } from '../../../../../libs/shared/src/constants/configuration.constant';
import { ConversationServiceClient } from '../../../../../libs/shared/src/types/chat';
import { CreateConversationRequestPayload } from './payload/conversation.request';
import { lastValueFrom } from 'rxjs';
import { AppError } from '../../../../../libs/shared/src';
import { GetConversationPageRequestPayload } from './payload/conversation.response';
import { dateFromString } from '../../../../../libs/shared/src/util/date.util';
import { AuthContextService } from '../../libs/auth-context.service';

@Injectable()
export class ConversationService {
  constructor(
    @Inject(CONVERSATION_SERVICE)
    private readonly conversationClient: ConversationServiceClient,
    private readonly authContextService: AuthContextService,
  ) {}

  async createConversation(body: CreateConversationRequestPayload) {
    const { success, error } = await lastValueFrom(
      this.conversationClient.createConversation({
        memberIdList: body.memberIdList,
        creatorId: this.authContextService.getUser().id,
      }),
    );
    if (!success) throw new AppError(error);
  }

  async getConversationPage(
    userId: number,
    page: number,
    size: number,
  ): Promise<GetConversationPageRequestPayload> {
    const { success, error, data } = await lastValueFrom(
      this.conversationClient.getConversationPage({
        profileId: userId,
        page: page,
        size: size,
      }),
    );
    if (!success) throw new AppError(error);

    return {
      totalPage: data.totalPage,
      conversationList: data.conversationList
        ? data.conversationList.map((item) => ({
            ...item,
            lastSendAt: dateFromString(item.lastSendAt),
          }))
        : [],
    };
  }
}
