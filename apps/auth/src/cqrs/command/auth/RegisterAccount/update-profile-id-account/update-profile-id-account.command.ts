import { ICommand } from '@nestjs/cqrs';

export class UpdateProfileIdAccountCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly profileId: number,
  ) {}
}
