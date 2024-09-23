import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiTags } from '@nestjs/swagger';
import { SendMessageRequestPayload } from './payload/message.request';
import { ResponseAPI } from '../../common/model/response-api';
import { ResponseMessage } from '../../../../../libs/shared/src';

@ApiTags('MESSAGE')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/send')
  async sendMessage(
    @Body() body: SendMessageRequestPayload,
  ): Promise<ResponseAPI<void>> {
    const data = await this.messageService.sendMessage(body);
    return { message: ResponseMessage.CREATE };
  }
}
