import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthServiceControllerMethods,
  AuthServiceController,
  RegisterAccountRequest,
  RegisterAccountResponse,
  Empty,
  VerifyJwtRequest,
  VerifyJwtResponse,
  LoginAccountRequest,
  LoginAccountResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  SendVerificationCodeRequest,
  SendVerificationCodeResponse,
} from '../../../../../libs/shared/src/types/auth';
import { Observable } from 'rxjs';

@Controller('account')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  async sendVerificationCode(
    request: SendVerificationCodeRequest,
  ): Promise<SendVerificationCodeResponse> {
    const data = await this.authService.sendVerificationCode(request);
    return { success: true };
  }
  async updatePassword(
    request: UpdatePasswordRequest,
  ): Promise<UpdatePasswordResponse> {
    const data = await this.authService.updatePassword(request);
    return { success: true };
  }
  async loginAccount(
    request: LoginAccountRequest,
  ): Promise<LoginAccountResponse> {
    const data = await this.authService.loginAccount(request);
    return { data, success: true };
  }
  async verifyJwt(request: VerifyJwtRequest): Promise<VerifyJwtResponse> {
    const data = await this.authService.verifyJwt(request);
    return { data, success: true };
  }

  async registerAccount(
    request: RegisterAccountRequest,
  ): Promise<RegisterAccountResponse> {
    await this.authService.registerAccount(request);

    return { success: true };
  }
}
