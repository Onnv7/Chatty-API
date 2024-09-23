import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode, HttpCodeMessage } from '@app/shared';
import { AppError } from '@app/shared';

const logger = new Logger('ExceptionHandler');
@Catch(AppError)
export class AppExceptionHandlerFilter implements ExceptionFilter<AppError> {
  catch(exception: AppError, host: ArgumentsHost) {
    console.log('🚀 ~ CustomExceptionHandlerFilter  ~ exception:', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpCodeMessage[exception.errorData.errorCode]).json({
      timestamp: new Date().toISOString(),
      error: exception.errorData,
    });
  }
}

@Catch(Error)
export class ExceptionHandlerFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log('🚀 ~ ExceptionHandlerFilter ~ exception: ', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message;

    response.status(500).json({
      timestamp: new Date().toISOString(),
      error: { errorCode: ErrorCode.SERVER_ERROR, errorMessage: message },
    });
  }
}
