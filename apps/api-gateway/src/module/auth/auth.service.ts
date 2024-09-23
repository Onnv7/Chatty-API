import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AppError } from '@app/shared';

import { ClientGrpc } from '@nestjs/microservices';
import {
  LoginAccountRequestPayload,
  RegisterAccountRequestPayload,
  SendVerificationCodeRequestPayload,
  UpdatePasswordRequestPayload,
} from './payload/auth.request';
import { firstValueFrom } from 'rxjs';
import {
  AuthServiceClient,
  AUTH_SERVICE_NAME,
} from '../../../../../libs/shared/src/types/auth';
import { AUTH_SERVICE_CLIENT } from '../../../../../libs/shared/src/constants/configuration.constant';
import { LoginAccountResponsePayload } from './payload/auth.response';
import { formatDate } from '../../../../../libs/shared/src/util/date.util';

@Injectable()
export class AuthService implements OnModuleInit {
  private authServiceClient: AuthServiceClient;
  constructor(
    @Inject(AUTH_SERVICE_CLIENT) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authServiceClient =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async createAccount(body: RegisterAccountRequestPayload): Promise<void> {
    const data = await firstValueFrom(
      this.authServiceClient.registerAccount({
        ...body,
        gender: body.gender,
        birthDate: formatDate(body.birthDate),
      }),
    );

    if (!data.success) {
      throw new AppError(data.error);
    }
  }

  async loginAccount(
    body: LoginAccountRequestPayload,
  ): Promise<LoginAccountResponsePayload & { refreshToken: string }> {
    const { error, success, data } = await firstValueFrom(
      this.authServiceClient.loginAccount(body),
    );
    if (!success) {
      throw new AppError(error);
    }
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  async updatePassword(
    accountId: number,
    body: UpdatePasswordRequestPayload,
  ): Promise<void> {
    await firstValueFrom(
      this.authServiceClient.updatePassword({
        accountId: accountId,
        ...body,
      }),
    );
  }

  async sendVerificationCode(
    body: SendVerificationCodeRequestPayload,
  ): Promise<void> {
    await firstValueFrom(
      this.authServiceClient.sendVerificationCode({
        ...body,
      }),
    );
  }
}
