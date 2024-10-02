import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import {
  LoginAccountRequestPayload,
  RegisterAccountRequestPayload,
  SendVerificationCodeRequestPayload,
  UpdatePasswordRequestPayload,
  VerifyEmailCodeRequestPayload,
} from './payload/auth.request';
import { ResponseAPI } from '../../common/model/response-api';
import { ResponseMessage } from '@app/shared';
import { ApiTags } from '@nestjs/swagger';
import { LoginAccountResponsePayload } from './payload/auth.response';
import { Response } from 'express';
import { ApiQueryURL } from '../../common/decorator/query-swagger.decorator';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async createAccount(
    @Body() body: RegisterAccountRequestPayload,
  ): Promise<ResponseAPI<any>> {
    const data = await this.authService.createAccount(body);

    return { data: data, message: ResponseMessage.CREATE };
  }

  @Post('/login')
  async loginAccount(
    @Body() body: LoginAccountRequestPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseAPI<LoginAccountResponsePayload>> {
    const { refreshToken, ...data } = await this.authService.loginAccount(body);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 12 * 24 * 60 * 60 * 1000,
    });
    return { data: data, message: ResponseMessage.CREATE };
  }

  @Patch('/update-password/account/:accountId')
  async updatePassword(
    @Body() body: UpdatePasswordRequestPayload,
    @Param('accountId') accountId: number,
  ): Promise<ResponseAPI<void>> {
    const data = await this.authService.updatePassword(accountId, body);

    return { message: ResponseMessage.UPDATE };
  }

  @Post('/send-code')
  async sendVerificationCode(
    @Body() body: SendVerificationCodeRequestPayload,
  ): Promise<ResponseAPI<void>> {
    const data = await this.authService.sendVerificationCode(body);

    return { message: ResponseMessage.CREATE };
  }

  @Post('/send-token-register')
  async sendVerificationToken(
    @Body() body: SendVerificationCodeRequestPayload,
  ): Promise<ResponseAPI<void>> {
    const data = await this.authService.sendVerificationToken(body);

    return { message: ResponseMessage.CREATE };
  }

  @Get('/verify-email-token')
  @ApiQueryURL([{ name: 'token', example: 'dfdcvfsndifnASIb' }])
  async verifyEmailToken(
    @Query('token') token: string,
  ): Promise<ResponseAPI<void>> {
    await this.authService.verifyEmailToken(token);
    return { message: ResponseMessage.UPDATE };
  }

  @Post('/verify-email-code')
  async verifyEmailCode(
    @Body() body: VerifyEmailCodeRequestPayload,
  ): Promise<ResponseAPI<void>> {
    await this.authService.verifyEmailCode(body);
    return { message: ResponseMessage.UPDATE };
  }
}
