import { ApiProperty } from '@nestjs/swagger';
import { SwaggerConstant } from '../../../common/constants/swagger.constant';
import { Gender } from '../../../../../../libs/shared/src/constants/enum';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class RegisterAccountRequestPayload {
  @ApiProperty({ example: SwaggerConstant.EMAIL_EX })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: SwaggerConstant.FIRST_NAME_EX })
  @IsString()
  firstName: string;

  @ApiProperty({ example: SwaggerConstant.LAST_NAME_EX })
  @IsString()
  lastName: string;

  @ApiProperty({ example: SwaggerConstant.PASSWORD_EX })
  @IsString()
  password: string;

  @ApiProperty({ enum: Gender, example: SwaggerConstant.GENDER_EX })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: SwaggerConstant.BIRTH_DATE_EX })
  @IsDate()
  @Type(() => Date)
  birthDate: Date;
}

export class LoginAccountRequestPayload {
  @ApiProperty({ example: SwaggerConstant.EMAIL_EX })
  @IsString()
  username: string;

  @ApiProperty({ example: SwaggerConstant.PASSWORD_EX })
  @IsString()
  password: string;
}

export class UpdatePasswordRequestPayload {
  @ApiProperty({ example: SwaggerConstant.PASSWORD_EX })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: SwaggerConstant.PASSWORD_EX })
  @IsString()
  newPassword: string;
}
export class SendVerificationCodeRequestPayload {
  @ApiProperty({ example: SwaggerConstant.EMAIL_EX })
  @IsString()
  email: string;
}
