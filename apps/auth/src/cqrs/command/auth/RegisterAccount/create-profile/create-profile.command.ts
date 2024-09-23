import { ICommand } from '@nestjs/cqrs';
import { Gender } from '../../../../../../../../libs/shared/src/constants/enum';

export class CreateProfileCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly accountId: number,
    public readonly birthDate: Date,
    public readonly gender: Gender,
  ) {}
}
