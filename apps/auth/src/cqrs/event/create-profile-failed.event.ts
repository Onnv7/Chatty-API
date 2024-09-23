import { IEvent } from '@nestjs/cqrs';
import { Subject } from 'rxjs';

export class CreateProfileFailedEvent implements IEvent {
  constructor(public readonly accountId: number) {}
}
