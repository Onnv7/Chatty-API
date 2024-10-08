import { Controller } from '@nestjs/common';
import { MessageService } from './message.service';
import {
  GetMessageRequest,
  GetMessageResponse,
  MessageServiceController,
  MessageServiceControllerMethods,
  ReactMessageRequest,
  ReactMessageResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '../../../../../libs/shared/src/types/chat';
import { Observable } from 'rxjs';

@Controller('message')
@MessageServiceControllerMethods()
export class MessageController implements MessageServiceController {
  constructor(private readonly messageService: MessageService) {}
  async reactMessage(
    request: ReactMessageRequest,
  ): Promise<ReactMessageResponse> {
    const data = await this.messageService.reactMessage(request);
    return { data, success: true };
  }

  async getMessagePage(
    request: GetMessageRequest,
  ): Promise<GetMessageResponse> {
    const data = await this.messageService.getMessagePage(request);
    return { data, success: true };
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const data = await this.messageService.sendMessage(request);
    return { data, success: true };
  }
}
