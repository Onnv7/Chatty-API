import { ICommand } from '@nestjs/cqrs';

export class UpdateProfileIdAccountCommand implements ICommand {
  constructor(
    public readonly username: string,
    public readonly profileId: number,
  ) {}
}
