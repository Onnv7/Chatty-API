import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  AppError,
  ErrorCode,
  ErrorResponseData,
  HttpCodeMessage,
} from '@app/shared';
import { RpcException } from '@nestjs/microservices';
import { Observable, of, throwError } from 'rxjs';
import { WsException, BaseWsExceptionFilter } from '@nestjs/websockets';

const logger = new Logger('USER_SERVER - [ERROR]');
@Catch(AppError)
export class MicroAppExceptionHandlerFilter
  implements ExceptionFilter<AppError>
{
  catch(exception: AppError, host: ArgumentsHost) {
    console.log(
      '🚀 ~ CustomExceptionHandlerFilter ~ exception:',
      exception.errorData,
    );
    logger.log(exception.stack);
    logger.log(exception.message);

    const ctx = host.switchToRpc();
    const call = ctx.getContext();

    return of({
      success: false,
      error: exception.errorData,
    });
  }
}

@Catch(Error)
export class MicroExceptionHandlerFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log('🚀 ~ ExceptionHandlerFilter : ', exception);
    logger.error(exception);
    const ctx = host.switchToRpc();
    const call = ctx.getContext();

    return of({
      success: false,
      error: ErrorResponseData.SERVER_ERROR,
    });
  }
}

@Catch(WsException)
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    console.log('socket error =>>>>>>>>>>>>');
    const client = host.switchToWs().getClient();
    const error = exception.getError();
    const details = typeof error === 'string' ? { message: error } : error;

    // Gửi thông báo lỗi cho client
    client.emit('exception', {
      status: 'error',
      ...details,
    });
  }
}
