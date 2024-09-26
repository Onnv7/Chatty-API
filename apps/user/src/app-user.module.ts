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

const repository = [ProfileRepository, FriendRepository];
const entityList = [ProfileEntity, FriendEntity];
const moduleList = [ProfileModule, FriendModule];
@Global()
@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRootAsync(TypeOrmConfig.getTypeOrmConfig()),
    TypeOrmModule.forFeature(entityList),
    ...moduleList,
    CqrsModule,
  ],
  controllers: [AppUserController],
  providers: [AppUserService, CreateProfileHandler, ...repository],
  exports: [...repository],
})
export class AppUserModule {}
