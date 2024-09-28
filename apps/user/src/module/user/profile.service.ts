import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../../database/repository/profile.repository';
import {
  CreateUserProfileData,
  CreateUserProfileRequest,
  GetProfileByIdData,
  GetProfileByIdRequest,
  SearchProfileData,
  SearchProfileRequest,
  UpdateProfileByIdRequest,
} from '../../../../../libs/shared/src/types/user';
import { AppError, ErrorResponseData } from '../../../../../libs/shared/src';
import { dateFromString } from '../../../../../libs/shared/src/util/date.util';
import { Gender } from '../../../../../libs/shared/src/constants/enum';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async createUserProfile(
    body: CreateUserProfileRequest,
  ): Promise<CreateUserProfileData> {
    let profileEntity = await this.profileRepository.findOneBy({
      email: body.email,
    });

    if (profileEntity) {
      throw new AppError(ErrorResponseData.EMAIL_EXISTED);
    }

    profileEntity = this.profileRepository.create({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      birthDate: dateFromString(body.birthDate),
      gender: body.gender as Gender,
    });

    profileEntity = await this.profileRepository.save(profileEntity);
    return { profileId: profileEntity.id };
  }

  async searchProfile(
    request: SearchProfileRequest,
  ): Promise<SearchProfileData> {
    const profileEntity = await this.profileRepository.findOneBy({
      email: request.email,
    });

    if (!profileEntity) {
      throw new AppError(ErrorResponseData.USER_NOT_FOUND);
    }
    return {
      id: profileEntity.id,
      firstName: profileEntity.firstName,
      lastName: profileEntity.lastName,
    };
  }

  async getProfileById(
    body: GetProfileByIdRequest,
  ): Promise<GetProfileByIdData> {
    const profileEntity = await this.profileRepository.findOneBy({
      id: body.id,
    });

    return {
      email: profileEntity.email,
      firstName: profileEntity.firstName,
      lastName: profileEntity.lastName,
      gender: profileEntity.lastName,
      birthDate: profileEntity.birthDate.toString(),
      avatarUrl: profileEntity.avatarUrl,
    };
  }

  async updateProfileById(body: UpdateProfileByIdRequest): Promise<void> {
    const { id, ...data } = body;
    let profileEntity = await this.profileRepository.findOneBy({
      id: id,
    });
    if (!profileEntity) {
      throw new AppError(ErrorResponseData.USER_NOT_FOUND);
    }
    profileEntity = {
      ...profileEntity,
      ...data,
      gender: data.gender as Gender,
      birthDate: dateFromString(data.birthDate),
    };
    await this.profileRepository.save(profileEntity);
  }
}
