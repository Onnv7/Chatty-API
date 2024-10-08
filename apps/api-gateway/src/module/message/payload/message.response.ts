import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MessageData {
  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  reactionList: string[];

  @ApiProperty()
  reactedCount: number;
}

export class MessageChainData {
  @ApiProperty({ type: [MessageData] })
  messageChain: MessageData[];

  @ApiProperty()
  senderId: number;
}
export class GetMessagePageResponsePayload {
  @ApiProperty()
  totalPage: number;

  @ApiProperty({ type: [MessageChainData] })
  messageList: MessageChainData[];
}

export class SendMessageResponsePayload {
  @ApiProperty()
  id: string;
}

export class ReactMessageResponsePayload {
  @ApiProperty({ isArray: true, type: String })
  reactionList: string[];

  @ApiProperty()
  reactedCount: number;
}
