import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccountCommand } from '../create-account.command';

import * as bcrypt from 'bcrypt';
import { AccountRepository } from '../../../../../../data/repository/account.repository';
import { CreateProfileFailedEvent } from '../../../../../event/create-profile-failed.event';
import { RollbackAccountCommand } from './rollback-account.command';

@CommandHandler(RollbackAccountCommand)
export class RollbackAccountHandler
  implements ICommandHandler<RollbackAccountCommand>
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly eventBus: EventBus,
  ) {}
  async execute(command: RollbackAccountCommand): Promise<any> {
    const accountEntity = await this.accountRepository.findOneBy({
      id: command.accountId,
    });
    console.log('deleting');
    await this.accountRepository.remove(accountEntity);
  }
}
