import { Controller } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import {
  ConversationServiceController,
  ConversationServiceControllerMethods,
  CreateConversationRequest,
  CreateConversationResponse,
  GetConversationListRequest,
  GetConversationListResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '../../../../../libs/shared/src/types/chat';
import { Observable } from 'rxjs';

@Controller('conversation')
@ConversationServiceControllerMethods()
export class ConversationController implements ConversationServiceController {
  constructor(private readonly conversationService: ConversationService) {}
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
