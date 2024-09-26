import { DataSource, Repository } from 'typeorm';
import { ProfileEntity } from '../entity/profile.entity';
import { Injectable } from '@nestjs/common';
import { FriendEntity } from '../entity/friend.entity';

@Injectable()
export class FriendRepository extends Repository<FriendEntity> {
  constructor(private dataSource: DataSource) {
    super(FriendEntity, dataSource.createEntityManager());
  }
}
