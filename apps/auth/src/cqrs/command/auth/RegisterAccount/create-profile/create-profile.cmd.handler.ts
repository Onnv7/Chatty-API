import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateProfileCommand } from './create-profile.command';
import { Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PROFILE_SERVICE } from '../../../../../../../../libs/shared/src/constants/configuration.constant';
import { CreateProfileFailedEvent } from '../../../../event/create-profile-failed.event';
import { AppError } from '../../../../../../../../libs/shared/src';
import { formatDate } from '../../../../../../../../libs/shared/src/util/date.util';
import { ProfileServiceClient } from '../../../../../../../../libs/shared/src/types/user';

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler
  implements ICommandHandler<CreateProfileCommand>
{
  constructor(
    @Inject(PROFILE_SERVICE)
    private readonly profileServiceClient: ProfileServiceClient,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProfileCommand): Promise<any> {
    const result = await lastValueFrom(
      this.profileServiceClient.createUserProfile({
        email: command.email,
        firstName: command.firstName,
        lastName: command.lastName,
        birthDate: formatDate(command.birthDate),
        accountId: command.accountId,
        gender: command.gender,
      }),
    );
    if (!result.success) {
      this.eventBus.publish(new CreateProfileFailedEvent(command.accountId));
      throw new AppError(result.error);
    }
    return result.data;
  }
}
