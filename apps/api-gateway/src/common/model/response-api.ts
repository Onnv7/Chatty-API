import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { ErrorData, DevError } from '@app/shared';

export class ResponseAPI<T = any> {
  @ApiProperty()
  message: string;
  @ApiProperty()
  data?: T;
}

export class ResponseError<T = any> {
  error: ErrorData;
  devError: DevError;
}
