import { Controller } from '@nestjs/common';
import {
  CreateUserProfileRequest,
  CreateUserProfileResponse,
  GetProfileByIdRequest,
  GetProfileByIdResponse,
  ProfileServiceController,
  ProfileServiceControllerMethods,
  SearchProfileRequest,
  SearchProfileResponse,
  UpdateProfileByIdRequest,
  UpdateProfileByIdResponse,
} from '../../../../../libs/shared/src/types/user';
import { Observable } from 'rxjs';
import { ProfileService } from './profile.service';
import { UserActiveData } from '../../../../../libs/shared/src/types/kafka/notification';
import { KAFKA_USER_ACTION_TOPIC } from '../../../../../libs/shared/src';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';

@Controller('user')
@ProfileServiceControllerMethods()
export class ProfileController implements ProfileServiceController {
  constructor(private readonly userService: ProfileService) {}
  async updateProfileById(
    request: UpdateProfileByIdRequest,
  ): Promise<UpdateProfileByIdResponse> {
    const data = await this.userService.updateProfileById(request);
    return { success: true };
  }
  async searchProfile(
    request: SearchProfileRequest,
  ): Promise<SearchProfileResponse> {
    const data = await this.userService.searchProfile(request);
    return { success: true, data };
  }
  async getProfileById(
    request: GetProfileByIdRequest,
  ): Promise<GetProfileByIdResponse> {
    const data = await this.userService.getProfileById(request);
    return { success: true, data };
  }

  async createUserProfile(
    request: CreateUserProfileRequest,
  ): Promise<CreateUserProfileResponse> {
    const data = await this.userService.createUserProfile(request);
    return { success: true, data };
  }

  @EventPattern(KAFKA_USER_ACTION_TOPIC, Transport.KAFKA)
  async sendNewMessage(@Payload() data: UserActiveData) {
    await this.userService.updateUserAction(data);
  }
}
