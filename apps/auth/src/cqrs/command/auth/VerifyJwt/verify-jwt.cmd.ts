import { ICommand } from '@nestjs/cqrs';

export class VerifyJwtCommand implements ICommand {
  constructor(public readonly token: string) {}
}
