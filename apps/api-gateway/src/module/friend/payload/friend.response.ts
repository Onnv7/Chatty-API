import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../../../../../libs/shared/src/constants/enum';

export class InvitationData {
  @ApiProperty()
  invitationId: number;

  @ApiProperty()
  profileId: number;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  gender: string;
}

export class GetReceivedInvitationListResponsePayload {
  @ApiProperty()
  totalPage: number;

  @ApiProperty({ type: [InvitationData] })
  invitationList: InvitationData[];
}

export class FriendData {
  @ApiProperty()
  profileId: number;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  invitationId?: number;
}

export class SearchFriendResponsePayload {
  @ApiProperty()
  totalPage: number;

  @ApiProperty({ type: [FriendData] })
  friendList: FriendData[];
}
