import { DataSource, Repository } from 'typeorm';
import { ProfileEntity } from '../entity/profile.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileRepository extends Repository<ProfileEntity> {
  constructor(private dataSource: DataSource) {
    super(ProfileEntity, dataSource.createEntityManager());
  }
}
