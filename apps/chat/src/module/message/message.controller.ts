import { Controller } from '@nestjs/common';
import { MessageService } from './message.service';
import {
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
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const data = await this.messageService.sendMessage(request);
    return { success: true };
  }
}
