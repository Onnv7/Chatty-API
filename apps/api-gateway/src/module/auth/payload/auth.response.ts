import { ApiProperty } from '@nestjs/swagger';
import { SwaggerConstant } from '../../../common/constants/swagger.constant';

export class LoginAccountResponsePayload {
  @ApiProperty({ example: SwaggerConstant.TOKEN_EX })
  accessToken: string;
}
