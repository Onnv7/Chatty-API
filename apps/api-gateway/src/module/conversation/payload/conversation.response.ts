import { ApiProperty } from '@nestjs/swagger';

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
}
export class GetConversationPageRequestPayload {
  @ApiProperty()
  totalPage: number;

  @ApiProperty({ type: [ConversationData] })
  conversationList: ConversationData[];
}
