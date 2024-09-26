import { Inject, Injectable } from '@nestjs/common';
import { FriendServiceClient } from '../../../../../libs/shared/src/types/user';
import {
  AppError,
  ErrorResponseData,
  FRIEND_SERVICE,
} from '../../../../../libs/shared/src';
import {
  ProcessInvitationPayload,
  SendInvitationPayload,
} from './payload/friend.request';
import { ResponseAPI } from '../../common/model/response-api';
import { lastValueFrom } from 'rxjs';
import {
  GetReceivedInvitationListResponsePayload,
  SearchFriendResponsePayload,
} from './payload/friend.response';
import {
  ActorType,
  Gender,
} from '../../../../../libs/shared/src/constants/enum';

@Injectable()
export class FriendService {
  constructor(
    @Inject(FRIEND_SERVICE)
    private readonly friendServiceClient: FriendServiceClient,
  ) {}

  async sendInvitation(body: SendInvitationPayload): Promise<void> {
    if (body.receiverId === body.senderId) {
      throw new AppError(ErrorResponseData.DATA_SEND_INVALID);
    }
    const { success, error } = await lastValueFrom(
      this.friendServiceClient.sendInvitation({
        receiverId: body.receiverId,
        senderId: body.senderId,
      }),
    );

    if (!success) throw new AppError(error);
  }

  async processInvitation(body: ProcessInvitationPayload): Promise<void> {
    const { success, error } = await lastValueFrom(
      this.friendServiceClient.processInvitation({
        invitationId: body.invitationId,
        action: body.action,
      }),
    );

    if (!success) throw new AppError(error);
  }

  async getReceivedInvitationList(
    userId: number,
    actor: ActorType,
    page: number,
    size: number,
  ): Promise<GetReceivedInvitationListResponsePayload> {
    const { data, success, error } = await lastValueFrom(
      this.friendServiceClient.getPendingInvitationList({
        userId: userId,
        actor,
        page,
        size,
      }),
    );

    if (!success) throw new AppError(error);
    return data;
  }

  async searchFriend(
    page: number,
    size: number,
    key?: string,
    gender?: Gender,
  ): Promise<SearchFriendResponsePayload> {
    const { data, success, error } = await lastValueFrom(
      this.friendServiceClient.searchFriend({
        key,
        gender,
        page,
        size,
      }),
    );

    if (!success) throw new AppError(error);
    return data;
  }
}
