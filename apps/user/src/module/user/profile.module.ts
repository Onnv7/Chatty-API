import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { CreateProfileHandler } from '../../cqrs/command/handler/create-profile.cmd.handler';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, CreateProfileHandler],
})
export class ProfileModule {}
