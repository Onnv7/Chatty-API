import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MessageData {
  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: string;
}

export class MessageChainData {
  @ApiProperty({ type: [MessageData] })
  messageChain: MessageData[];

  @ApiProperty()
  senderId: number;

  @ApiProperty()
  avatarUrl: string;
}
export class GetMessagePageResponsePayload {
  @ApiProperty()
  totalPage: number;

  @ApiProperty({ type: [MessageChainData] })
  messageList: MessageChainData[];
}
