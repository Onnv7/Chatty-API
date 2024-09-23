import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileIdAccountCommand } from './update-profile-id-account.command';
import { AccountRepository } from '../../../../../data/repository/account.repository';

@CommandHandler(UpdateProfileIdAccountCommand)
export class UpdateProfileIdAccountHandler
  implements ICommandHandler<UpdateProfileIdAccountCommand>
{
  constructor(private readonly accountRepository: AccountRepository) {}
  async execute(command: UpdateProfileIdAccountCommand): Promise<any> {
    const accountEntity = await this.accountRepository.findOneBy({
      username: command.username,
    });
    accountEntity.profileId = command.profileId;
    await this.accountRepository.save(accountEntity);
  }
}
