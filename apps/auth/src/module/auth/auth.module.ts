import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CreateAccountHandler } from '../../cqrs/command/auth/RegisterAccount/create-account/create-account.cmd.handler';
import { TokenModule } from '../../../../../libs/token/src';
import { AccountSaga } from '../../cqrs/saga/accout.saga';
import { CqrsModule } from '@nestjs/cqrs';
import { RollbackAccountHandler } from '../../cqrs/command/auth/RegisterAccount/create-account/rollback/rollback-account.cmd.handler';
import { CreateProfileHandler } from '../../cqrs/command/auth/RegisterAccount/create-profile/create-profile.cmd.handler';
import { UpdateProfileIdAccountHandler } from '../../cqrs/command/auth/RegisterAccount/update-profile-id-account/update-profile-id-account.cmd.handler';

const commandHandlers = [
  CreateAccountHandler,
  CreateProfileHandler,
  UpdateProfileIdAccountHandler,
];

@Module({
  imports: [TokenModule, CqrsModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...commandHandlers,
    RollbackAccountHandler,
    AccountSaga,
  ],
})
export class AuthModule {}
