import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { SwaggerConstant } from '../../../common/constants/swagger.constant';
import { Gender } from '../../../../../../libs/shared/src/constants/enum';
import { Type } from 'class-transformer';

export class UpdateProfileRequestPayload {
  @ApiProperty({ example: SwaggerConstant.FIRST_NAME_EX })
  @IsString()
  firstName: string;

  @ApiProperty({ example: SwaggerConstant.LAST_NAME_EX })
  @IsString()
  lastName: string;

  @ApiProperty({ example: SwaggerConstant.GENDER_EX })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: SwaggerConstant.BIRTH_DATE_EX })
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @ApiProperty({ example: SwaggerConstant.INTRODUCE_EX })
  @IsString()
  introduction: string;
}
