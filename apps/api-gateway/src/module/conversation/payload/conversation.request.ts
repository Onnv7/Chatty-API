import { ApiProperty } from '@nestjs/swagger';
import { SwaggerConstant } from '../../../common/constants/swagger.constant';
import { IsArray } from 'class-validator';

export class CreateConversationRequestPayload {
  @ApiProperty({
    type: [],
    isArray: true,
    example: SwaggerConstant.MEMBER_ID_LIST,
  })
  @IsArray()
  memberIdList: number[];
}
