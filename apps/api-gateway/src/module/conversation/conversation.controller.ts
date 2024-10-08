import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateConversationRequestPayload } from './payload/conversation.request';
import { ResponseAPI } from '../../common/model/response-api';
import { ResponseMessage } from '../../../../../libs/shared/src';
import {
  GetConversationByFriendIdResponsePayload,
  GetConversationPageResponsePayload,
  GetConversationResponsePayload,
} from './payload/conversation.response';
import { ApiQueryURL } from '../../common/decorator/query-swagger.decorator';

@ApiTags('CONVERSATION')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('/')
  async createConversation(
    @Body() body: CreateConversationRequestPayload,
  ): Promise<ResponseAPI<void>> {
    const data = await this.conversationService.createConversation(body);
    return { message: ResponseMessage.CREATE };
  }

  @Get('/user/:userId')
  @ApiQueryURL([
    { name: 'page', example: 1 },
    { name: 'size', example: 10 },
  ])
  async getConversationPage(
    @Param('userId') userId: number,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<ResponseAPI<GetConversationPageResponsePayload>> {
    const data = await this.conversationService.getConversationPage(
      userId,
      page,
      size,
    );
    return { data, message: ResponseMessage.GET };
  }

  @Get('/:conversationId')
  async getConversation(
    @Param('conversationId') conversationId: string,
  ): Promise<ResponseAPI<GetConversationResponsePayload>> {
    const data = await this.conversationService.getConversation(conversationId);
    return { data, message: ResponseMessage.GET };
  }

  @Get('/exist/user/:userId')
  async getConversationByFriendId(
    @Param('userId') userId: number,
    @Query('friendId') friendId: number,
  ): Promise<ResponseAPI<GetConversationByFriendIdResponsePayload>> {
    const data = await this.conversationService.getConversationByFriendId(
      userId,
      friendId,
    );
    return { data, message: ResponseMessage.GET };
  }
}
