import { Global, Module } from '@nestjs/common';
import { AppUserController } from './app-user.controller';
import { AppUserService } from './app-user.service';
import { ProfileModule } from './module/user/profile.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileRepository } from './database/repository/profile.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from './common/config/typeorm.config';
import { CreateProfileHandler } from './cqrs/command/handler/create-profile.cmd.handler';
import { SharedModule, SharedService } from '../../../libs/shared/src';
import { ProfileEntity } from './database/entity/profile.entity';
import { FriendRepository } from './database/repository/friend.repository';
import { FriendEntity } from './database/entity/friend.entity';
import { FriendModule } from './module/friend/friend.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import RedisConfig from '../../notification/src/common/config/redis.config';

const repository = [ProfileRepository, FriendRepository];
const entityList = [ProfileEntity, FriendEntity];
const moduleList = [ProfileModule, FriendModule];
@Global()
@Module({
  imports: [
    SharedModule,
    RedisModule.forRootAsync({
      inject: [SharedService],
      useFactory: (sharedService: SharedService) =>
        RedisConfig.getConfig(sharedService),
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfig.getTypeOrmConfig()),
    TypeOrmModule.forFeature(entityList),
    ...moduleList,
    CqrsModule,
  ],
  controllers: [AppUserController],
  providers: [AppUserService, CreateProfileHandler, ...repository],
  exports: [...repository, RedisModule, SharedModule],
})
export class AppUserModule {}
