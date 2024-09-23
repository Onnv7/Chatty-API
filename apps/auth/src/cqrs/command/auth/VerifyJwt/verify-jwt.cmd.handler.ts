import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyJwtCommand } from './verify-jwt.cmd';
import {
  AppError,
  ErrorResponseData,
} from '../../../../../../../libs/shared/src';
import { TokenService } from '../../../../../../../libs/token/src';
import { VerifyJwtData } from '../../../../../../../libs/shared/src/types/auth';

@CommandHandler(VerifyJwtCommand)
export class VerifyJwtHandler implements ICommandHandler<VerifyJwtCommand> {
  constructor(private readonly tokenService: TokenService) {}

  async execute(command: VerifyJwtCommand): Promise<VerifyJwtData> {
    const payload = this.tokenService.verifyAccessToken(command.token);
    if (!payload) {
      throw new AppError(ErrorResponseData.UNAUTHORIZED);
    }

    return {
      id: payload.id,
      email: payload.email,
    };
  }
}
