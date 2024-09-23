import { ICommand } from '@nestjs/cqrs';

export class RollbackAccountCommand implements ICommand {
  constructor(public readonly accountId: number) {}
}
