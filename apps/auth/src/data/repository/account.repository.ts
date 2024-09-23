import { DataSource, Repository } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountRepository extends Repository<AccountEntity> {
  constructor(private dataSource: DataSource) {
    super(AccountEntity, dataSource.createEntityManager());
  }
}
