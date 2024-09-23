import { ApiProperty } from '@nestjs/swagger';

export class ConversationData {
  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  lastMessage: string;

  @ApiProperty()
  lastSendAt: Date;
}
export class GetConversationPageRequestPayload {
  @ApiProperty()
  totalPage: number;

  @ApiProperty({ type: [ConversationData] })
  conversationList: ConversationData[];
}
