import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProfileCommand } from '../create-profile.command';
import { ProfileRepository } from '../../../database/repository/profile.repository';
import { AppError, ErrorResponseData } from '../../../../../../libs/shared/src';

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler
  implements ICommandHandler<CreateProfileCommand>
{
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(command: CreateProfileCommand): Promise<void> {
    let profileEntity = await this.profileRepository.findOneBy({
      email: command.email,
    });
    if (profileEntity) {
      throw new AppError(ErrorResponseData.EMAIL_EXISTED);
    }

    profileEntity = this.profileRepository.create({
      email: command.email,
      firstName: command.firstName,
      lastName: command.lastName,
    });
    await this.profileRepository.save(profileEntity);
  }
}
