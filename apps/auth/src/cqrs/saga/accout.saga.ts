import { Injectable } from '@nestjs/common';
import { CommandBus, Saga, ofType } from '@nestjs/cqrs';
import { Observable, from, switchMap } from 'rxjs';

import { CreateProfileFailedEvent } from '../event/create-profile-failed.event';
import { RollbackAccountCommand } from '../command/auth/RegisterAccount/create-account/rollback/rollback-account.command';

@Injectable()
export class AccountSaga {
  constructor(private readonly commandBus: CommandBus) {}

  @Saga()
  accountCreationSaga = (events$: Observable<any>) => {
    return events$.pipe(
      ofType(CreateProfileFailedEvent),
      switchMap((event: CreateProfileFailedEvent) => {
        return from(
          this.commandBus.execute(new RollbackAccountCommand(event.accountId)),
        );
      }),
    );
  };
}
