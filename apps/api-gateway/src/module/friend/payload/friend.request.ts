import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { SwaggerConstant } from '../../../common/constants/swagger.constant';
import { InvitationAction } from '../../../../../../libs/shared/src/constants/enum';

export class SendInvitationPayload {
  @ApiProperty({ example: SwaggerConstant.SENDER_ID_EX })
  @IsNumber()
  senderId: number;

  @ApiProperty({ example: SwaggerConstant.RECEIVER_ID_EX })
  @IsNumber()
  receiverId: number;
}

export class ProcessInvitationPayload {
  @ApiProperty({ example: SwaggerConstant.SENDER_ID_EX })
  @IsNumber()
  invitationId: number;

  @ApiProperty({ example: SwaggerConstant.INVITATION_ACTION_EX })
  @IsEnum(InvitationAction)
  action: InvitationAction;
}
