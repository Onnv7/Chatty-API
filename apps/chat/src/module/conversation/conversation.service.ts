import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async getConversationPage(
    body: GetConversationListRequest,
  ): Promise<GetConversationListData> {
    const data = await this.conversationRepository.getConversationPageById(
      body.profileId,
      body.page,
      body.size,
    );
    return {
      totalPage: data.totalPage,
      conversationList: data.conversationList.map((item) => ({
        lastSendAt: item.lastMessage.toString(),
        name: 'hihi',
        imageUrl: 'url',
        lastMessage: 'last',
      })),
    };
  }

  async createConversation(
    body: CreateConversationRequest,
  ): Promise<CreateConversationData> {
    const conversationDoc: Partial<Conversation> = {
      memberIdList: body.memberIdList.sort((a, b) => b - a),
    };
    const data = await this.conversationRepository.create(conversationDoc);
    return { conversationId: data.id };
  }
}
