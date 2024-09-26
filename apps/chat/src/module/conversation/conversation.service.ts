import { Inject, Injectable } from '@nestjs/common';
import { ConversationRepository } from '../../database/repository/convervation.repository';
import { MessageRepository } from '../../database/repository/message.repository';
import {
  CreateConversationData,
  CreateConversationRequest,
  GetConversationListData,
  GetConversationListRequest,
  SendMessageRequest,
} from '../../../../../libs/shared/src/types/chat';
import { Conversation } from '../../database/schema/conversation.schema';
import {
  AppError,
  ErrorResponseData,
  PROFILE_SERVICE,
} from '../../../../../libs/shared/src';
import { ProfileServiceClient } from '../../../../../libs/shared/src/types/user';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    @Inject(PROFILE_SERVICE)
    private readonly profileServiceClient: ProfileServiceClient,
  ) {}

  async getConversationPage(
    body: GetConversationListRequest,
  ): Promise<GetConversationListData> {
    const conversationPage =
      await this.conversationRepository.getConversationPageById(
        body.profileId,
        body.page,
        body.size,
      );
    const conversationList = await Promise.all(
      conversationPage.conversationList.map(async (conversation) => {
        const receiverId = conversation.memberIdList.find(
          (id) => id !== body.profileId,
        );
        const { success, data, error } = await lastValueFrom(
          this.profileServiceClient.getProfileById({ id: receiverId }),
        );
        if (!success) throw new AppError(error);
        return {
          id: conversation.id,
          lastSendAt: conversation.updatedAt.toISOString(),
          name: data.firstName + ' ' + data.lastName,
          imageUrl: data.avatarUrl,
          lastMessage: conversation.lastMessage,
        };
      }),
    );
    return {
      totalPage: conversationPage.totalPage,
      conversationList: conversationList,
    };
  }

  async createConversation(
    body: CreateConversationRequest,
  ): Promise<CreateConversationData> {
    const conversation = await this.conversationRepository.getByMemberIdList(
      body.memberIdList,
    );
    if (conversation) {
      throw new AppError(ErrorResponseData.CONVERSATION_EXISTED);
    }
    const conversationDoc: Partial<Conversation> = {
      memberIdList: body.memberIdList.sort((a, b) => b - a),
      senderId: null,
    };
    const data = await this.conversationRepository.create(conversationDoc);
    return { conversationId: data.id };
  }
}
