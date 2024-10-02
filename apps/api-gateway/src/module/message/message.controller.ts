import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SendMessageRequestPayload } from './payload/message.request';
import { ResponseAPI } from '../../common/model/response-api';
import { ResponseMessage } from '../../../../../libs/shared/src';
import { ApiQueryURL } from '../../common/decorator/query-swagger.decorator';
import {
  GetMessagePageResponsePayload,
  SendMessageResponsePayload,
} from './payload/message.response';
import { JwtGuard } from '../../common/guard/jwt.guard';

@ApiTags('MESSAGE')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post('/send')
  async sendMessage(
    @Body() body: SendMessageRequestPayload,
  ): Promise<ResponseAPI<SendMessageResponsePayload>> {
    const data = await this.messageService.sendMessage(body);
    return { data, message: ResponseMessage.CREATE };
  }

  @Get('/conversation/:conversationId')
  @ApiQueryURL([
    { name: 'page', example: 1 },
    { name: 'size', example: 10 },
  ])
  async getMessagePage(
    @Param('conversationId') conversationId: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<ResponseAPI<GetMessagePageResponsePayload>> {
    const data = await this.messageService.getMessagePage(
      conversationId,
      page,
      size,
    );
    return { data, message: ResponseMessage.GET };
  }
}
