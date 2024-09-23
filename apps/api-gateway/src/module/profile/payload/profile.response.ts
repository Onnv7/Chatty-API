import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../../../../../libs/shared/src/constants/enum';

export class SearchProfileResponsePayload {
  @ApiProperty()
  id: number;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
}

export class GetUserProfileResponsePayload {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  avatarUrl: string;
  @ApiProperty()
  gender: Gender;
  @ApiProperty()
  birthDate: Date;
}
