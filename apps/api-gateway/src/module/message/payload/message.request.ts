import { ApiProperty } from '@nestjs/swagger';
import { SwaggerConstant } from '../../../common/constants/swagger.constant';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class SendMessageRequestPayload {
  @ApiProperty({ example: SwaggerConstant.CONTENT_EX })
  @IsString()
  content: string;

  @ApiProperty({ example: SwaggerConstant.SENDER_ID_EX })
  @IsNumber()
  senderId: number;

  @ApiProperty({ example: SwaggerConstant.CONVERSATION_ID_EX })
  @IsOptional()
  @IsString()
  conversationId: string;

  @ApiProperty({
    type: [],
    isArray: true,
    example: SwaggerConstant.MEMBER_ID_LIST,
  })
  @IsArray()
  @IsOptional()
  memberIdList: number[];
}

export class ReactMessageRequestPayload {
  @ApiProperty({ example: SwaggerConstant.REACTION_EX })
  @IsString()
  reaction: string;

  @ApiProperty({ example: SwaggerConstant.OBJECT_ID_EX })
  @IsString()
  messageId: string;

  @ApiProperty({ example: SwaggerConstant.OBJECT_ID_EX })
  @IsNumber()
  senderId: number;
}
