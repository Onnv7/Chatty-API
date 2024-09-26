import { Controller } from '@nestjs/common';
import { FriendService } from './friend.service';
import {
  FriendServiceController,
  FriendServiceControllerMethods,
  GetPendingInvitationListRequest,
  GetPendingInvitationListResponse,
  ProcessInvitationRequest,
  ProcessInvitationResponse,
  SearchFriendRequest,
  SearchFriendResponse,
  SendInvitationRequest,
  SendInvitationResponse,
} from '../../../../../libs/shared/src/types/user';
import { Observable } from 'rxjs';

@Controller('friend')
@FriendServiceControllerMethods()
export class FriendController implements FriendServiceController {
  constructor(private readonly friendService: FriendService) {}
  async searchFriend(
    request: SearchFriendRequest,
  ): Promise<SearchFriendResponse> {
    const data = await this.friendService.searchFriend(request);
    return { data, success: true };
  }

  async getPendingInvitationList(
    request: GetPendingInvitationListRequest,
  ): Promise<GetPendingInvitationListResponse> {
    const data = await this.friendService.getPendingInvitationList(request);
    return { data, success: true };
  }
  async sendInvitation(
    request: SendInvitationRequest,
  ): Promise<SendInvitationResponse> {
    const data = await this.friendService.sendFriendInvitation(request);
    return { success: true };
  }

  async processInvitation(
    request: ProcessInvitationRequest,
  ): Promise<ProcessInvitationResponse> {
    const data = await this.friendService.processFriendInvitation(request);
    return { success: true };
  }
}
