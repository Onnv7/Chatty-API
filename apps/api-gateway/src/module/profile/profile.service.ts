import { Inject, Injectable } from '@nestjs/common';
import {
  GetUserProfileResponsePayload,
  SearchProfileResponsePayload,
} from './payload/profile.response';
import { PROFILE_SERVICE } from '../../../../../libs/shared/src/constants/configuration.constant';
import { lastValueFrom } from 'rxjs';
import { AppError } from '../../../../../libs/shared/src';
import {
  dateFromString,
  formatDate,
} from '../../../../../libs/shared/src/util/date.util';
import { Gender } from '../../../../../libs/shared/src/constants/enum';
import { ProfileServiceClient } from '../../../../../libs/shared/src/types/user';
import { UpdateProfileRequestPayload } from './payload/profile.request';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_SERVICE)
    private readonly profileServiceClient: ProfileServiceClient,
  ) {}

  async searchProfile(email: string): Promise<SearchProfileResponsePayload> {
    const { data, error, success } = await lastValueFrom(
      this.profileServiceClient.searchProfile({ email: email }),
    );
    if (!success) throw new AppError(error);
    return data as SearchProfileResponsePayload;
  }

  async getUserProfile(userId: number): Promise<GetUserProfileResponsePayload> {
    const { data, error, success } = await lastValueFrom(
      this.profileServiceClient.getProfileById({ id: userId }),
    );

    if (!success) throw new AppError(error);
    return {
      ...data,
      gender: data.gender as Gender,
      birthDate: dateFromString(data.birthDate),
    };
  }

  async updateProfile(
    userId: number,
    body: UpdateProfileRequestPayload,
  ): Promise<void> {
    const { error, success } = await lastValueFrom(
      this.profileServiceClient.updateProfileById({
        id: userId,
        ...body,
        birthDate: formatDate(body.birthDate),
      }),
    );

    if (!success) throw new AppError(error);
  }
}
