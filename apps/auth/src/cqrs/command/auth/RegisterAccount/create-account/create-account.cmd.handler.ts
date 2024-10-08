import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import * as bcrypt from 'bcrypt';
import { AccountRepository } from '../../../../../data/repository/account.repository';
import {
  AppError,
  ErrorResponseData,
  SharedService,
} from '../../../../../../../../libs/shared/src';
import { CreateAccountCommand } from './create-account.command';
import { MailVerificationRepository } from '../../../../../data/repository/mail-verification.repository';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand>
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly mailVerificationRepository: MailVerificationRepository,
    private readonly eventBus: EventBus,
    private readonly sharedService: SharedService,
  ) {}
  async execute(command: CreateAccountCommand): Promise<any> {
    let accountEntity = await this.accountRepository.findOneBy({
      username: command.email,
    });

    if (accountEntity) {
      throw new AppError(ErrorResponseData.EMAIL_EXISTED);
    }

    accountEntity = this.accountRepository.create({
      username: command.email,
      password: await bcrypt.hash(
        command.password,
        this.sharedService.env.SALT_PASSWORD,
      ),
      profileId: 1,
    });

    accountEntity = await this.accountRepository.save(accountEntity);
    return accountEntity;
  }
}
