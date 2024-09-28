import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FriendService } from './friend.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../../../../libs/shared/src';
import { ResponseAPI } from '../../common/model/response-api';
import {
  ProcessInvitationPayload,
  SendInvitationPayload,
} from './payload/friend.request';
import { ApiQueryURL } from '../../common/decorator/query-swagger.decorator';
import {
  GetReceivedInvitationListResponsePayload,
  SearchFriendResponsePayload,
} from './payload/friend.response';
import {
  ActorType,
  Gender,
} from '../../../../../libs/shared/src/constants/enum';
import { SwaggerConstant } from '../../common/constants/swagger.constant';

@ApiTags('FRIEND')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post('/invitation/send')
  async sendInvitation(
    @Body() body: SendInvitationPayload,
  ): Promise<ResponseAPI<void>> {
    const data = await this.friendService.sendInvitation(body);
    return { message: ResponseMessage.CREATE };
  }

  @Put('/invitation/process')
  async processInvitation(
    @Body() body: ProcessInvitationPayload,
  ): Promise<ResponseAPI<void>> {
    const data = await this.friendService.processInvitation(body);
    return { message: ResponseMessage.UPDATE };
  }

  @Get('/invitation/user/:userId')
  @ApiQueryURL([
    { name: 'page', example: 1 },
    { name: 'size', example: 10 },
    { name: 'actor', enum: ActorType, example: ActorType.RECEIVER },
  ])
  async getReceivedInvitationList(
    @Param('userId') userId: number,
    @Query('actor') actor: ActorType,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<ResponseAPI<GetReceivedInvitationListResponsePayload>> {
    console.log('🚀 ~ FriendController ~ userId:', userId);
    const data = await this.friendService.getReceivedInvitationList(
      userId,
      actor,
      page,
      size,
    );
    return { data, message: ResponseMessage.UPDATE };
  }

  @Get('/search')
  @ApiQueryURL([
    { name: 'page', example: 1 },
    { name: 'size', example: 10 },
    { name: 'key', example: SwaggerConstant.SEARCH_FRIEND_EX },
    { name: 'gender', enum: Gender, example: Gender.FEMALE, required: false },
  ])
  async searchFriend(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('userId') userId: number,
    @Query('key') key: string,
    @Query('gender') gender?: Gender,
  ): Promise<ResponseAPI<SearchFriendResponsePayload>> {
    const data = await this.friendService.searchFriend(
      page,
      size,
      userId,
      key,
      gender,
    );
    return { data, message: ResponseMessage.GET };
  }
}
