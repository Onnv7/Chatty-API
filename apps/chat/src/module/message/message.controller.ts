import { Controller } from '@nestjs/common';
import { MessageService } from './message.service';
import {
  GetMessageRequest,
  GetMessageResponse,
  MessageServiceController,
  MessageServiceControllerMethods,
  SendMessageRequest,
  SendMessageResponse,
} from '../../../../../libs/shared/src/types/chat';
import { Observable } from 'rxjs';

@Controller('message')
@MessageServiceControllerMethods()
export class MessageController implements MessageServiceController {
  constructor(private readonly messageService: MessageService) {}

  async getMessagePage(
    request: GetMessageRequest,
  ): Promise<GetMessageResponse> {
    const data = await this.messageService.getMessagePage(request);
    return { data, success: true };
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const data = await this.messageService.sendMessage(request);
    return { success: true };
  }
}
