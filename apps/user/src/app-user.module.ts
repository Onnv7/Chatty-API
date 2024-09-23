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

const repository = [ProfileRepository];
const entityList = [ProfileEntity];

@Global()
@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRootAsync(TypeOrmConfig.getTypeOrmConfig()),
    TypeOrmModule.forFeature(entityList),
    ProfileModule,
    CqrsModule,
  ],
  controllers: [AppUserController],
  providers: [AppUserService, CreateProfileHandler, ...repository],
  exports: [...repository],
})
export class AppUserModule {}
