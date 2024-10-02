import { ApiProperty } from '@nestjs/swagger';
import { ActiveStatus } from '../../../../../../libs/shared/src/constants/enum';

export class ConversationData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  lastMessage: string;

  @ApiProperty()
  lastSendAt: Date;

  @ApiProperty()
  senderId: number;

  @ApiProperty()
  activeStatus: ActiveStatus;

  @ApiProperty()
  lastActiveAt: Date;

  @ApiProperty()
  friendId?: number;
}
export class GetConversationPageResponsePayload {
  @ApiProperty()
  totalPage: number;

  @ApiProperty({ type: [ConversationData] })
  conversationList: ConversationData[];
}

export class ConversationMemberData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  avatarUrl: string;
}

export class GetConversationRequestPayload {
  @ApiProperty()
  memberList: ConversationMemberData[];
}
