import { Controller } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import {
  ConversationServiceController,
  ConversationServiceControllerMethods,
  CreateConversationRequest,
  CreateConversationResponse,
  GetConversationListRequest,
  GetConversationListResponse,
  GetConversationRequest,
  GetConversationResponse,
} from '../../../../../libs/shared/src/types/chat';

@Controller('conversation')
@ConversationServiceControllerMethods()
export class ConversationController implements ConversationServiceController {
  constructor(private readonly conversationService: ConversationService) {}
  async getConversation(
    request: GetConversationRequest,
  ): Promise<GetConversationResponse> {
    const data = await this.conversationService.getConversation(request);
    return { data, success: true };
  }
  async getConversationPage(
    request: GetConversationListRequest,
  ): Promise<GetConversationListResponse> {
    const data = await this.conversationService.getConversationPage(request);
    return { data, success: true };
  }

  async createConversation(
    request: CreateConversationRequest,
  ): Promise<CreateConversationResponse> {
    const data = await this.conversationService.createConversation(request);
    return { data, success: true };
  }
}
