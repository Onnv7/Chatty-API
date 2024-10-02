import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { AppError, ErrorResponseData, SharedService } from '@app/shared';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from '../../cqrs/command/auth/RegisterAccount/create-account/create-account.command';
import {
  LoginAccountRequest,
  RegisterAccountRequest,
  SendVerificationCodeRequest,
  SendVerificationTokenRequest,
  UpdatePasswordRequest,
  VerifyCodeRequest,
  VerifyJwtData,
  VerifyJwtRequest,
  VerifyTokenRequest,
} from '../../../../../libs/shared/src/types/auth';
import { AccountRepository } from '../../data/repository/account.repository';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../../../../../libs/token/src';
import {
  KAFKA_SEND_CODE_TOPIC,
  NOTIFICATION_SERVICE_CLIENT_KAFKA,
  PROFILE_SERVICE,
} from '../../../../../libs/shared/src/constants/configuration.constant';
import { AccountEntity } from '../../data/entity/account.entity';
import { CreateProfileCommand } from '../../cqrs/command/auth/RegisterAccount/create-profile/create-profile.command';
import { UpdateProfileIdAccountCommand as UpdateProfileIdAccountAndSendTokenCommand } from '../../cqrs/command/auth/RegisterAccount/update-profile-id-account/update-profile-id-account.command';
import { VerifyJwtCommand } from '../../cqrs/command/auth/VerifyJwt/verify-jwt.cmd';
import { Gender } from '../../../../../libs/shared/src/constants/enum';
import { dateFromString } from '../../../../../libs/shared/src/util/date.util';
import { ProfileServiceClient } from '../../../../../libs/shared/src/types/user';
import { NumberUtil } from '../../../../api-gateway/src/common/util/number.util';
import { MailVerificationRepository } from '../../data/repository/mail-verification.repository';
import { DateTimeUtil } from '../../../../api-gateway/src/common/util/datetime.util';
import { ClientKafka } from '@nestjs/microservices';
import { SendEmailVerificationData } from '../../../../../libs/shared/src/types/kafka/notification';
import { profile } from 'console';

@Injectable()
export class AuthService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly mailVerificationRepository: MailVerificationRepository,
    private readonly commandBus: CommandBus,
    private readonly tokenService: TokenService,
    @Inject(PROFILE_SERVICE)
    private readonly userServiceClient: ProfileServiceClient,
    private readonly sharedService: SharedService,
    @Inject(NOTIFICATION_SERVICE_CLIENT_KAFKA)
    private readonly notificationClient: ClientKafka,
  ) {}

  async onApplicationShutdown(signal?: string) {
    await this.notificationClient.close();
  }
  async onModuleInit() {
    await this.notificationClient.connect();
  }

  async verifyToken(body: VerifyTokenRequest): Promise<void> {
    const emailVerification = await this.mailVerificationRepository.findOneBy({
      token: body.token,
    });

    if (!emailVerification) {
      throw new AppError(ErrorResponseData.EMAIL_NOT_FOUND);
    }
    if (emailVerification.expiredAt < new Date()) {
      throw new AppError(ErrorResponseData.UNAUTHORIZED);
    }
    const verified = this.tokenService.verifyToken(body.token);

    if (!verified) {
      throw new AppError(ErrorResponseData.UNAUTHORIZED);
    }

    const accountEntity = await this.accountRepository.findOneBy({
      username: emailVerification.email,
    });
    if (!accountEntity) {
      throw new AppError(ErrorResponseData.ACCOUNT_NOT_FOUND);
    }
    accountEntity.isVerified = true;
    emailVerification.isVerified = true;
    await this.mailVerificationRepository.remove(emailVerification);
    await this.accountRepository.save(accountEntity);
  }

  async verifyCode(body: VerifyCodeRequest): Promise<void> {
    const emailVerification = await this.mailVerificationRepository.findOneBy({
      email: body.email,
    });
    if (!emailVerification) {
      throw new AppError(ErrorResponseData.EMAIL_NOT_FOUND);
    }
    if (
      emailVerification.token !== body.code ||
      emailVerification.expiredAt < new Date()
    ) {
      throw new AppError(ErrorResponseData.UNAUTHORIZED);
    }

    emailVerification.isVerified = true;
    await this.mailVerificationRepository.save(emailVerification);
  }

  async sendVerificationCode(body: SendVerificationCodeRequest): Promise<void> {
    const accountEntity = await this.accountRepository.findOneBy({
      username: body.email,
    });

    if (accountEntity) {
      throw new AppError(ErrorResponseData.EMAIL_EXISTED);
    }
    const emailVerificationEntity =
      await this.mailVerificationRepository.findOneBy({
        email: body.email,
      });

    if (
      emailVerificationEntity &&
      new Date() <= emailVerificationEntity.expiredAt
    ) {
      throw new AppError(ErrorResponseData.FLOW_INCORRECT);
    }
    if (emailVerificationEntity) {
      await this.mailVerificationRepository.remove(emailVerificationEntity);
    }
    const code = NumberUtil.generateVerificationCode();
    const newEmailVerification = this.mailVerificationRepository.create({
      email: body.email,
      token: code,
      expiredAt: DateTimeUtil.plusTime(new Date(), { minutes: 1, seconds: 30 }),
    });

    await this.mailVerificationRepository.save(newEmailVerification);

    this.notificationClient.emit<any, SendEmailVerificationData>(
      KAFKA_SEND_CODE_TOPIC,
      {
        email: body.email,
        token: code,
        type: 'code',
      },
    );
  }

  async sendVerificationToken(
    body: SendVerificationTokenRequest,
  ): Promise<void> {
    const accountEntity = await this.accountRepository.findOneBy({
      username: body.email,
    });

    if (accountEntity) {
      throw new AppError(ErrorResponseData.EMAIL_EXISTED);
    }
    const emailVerificationEntity =
      await this.mailVerificationRepository.findOneBy({
        email: body.email,
      });

    if (
      emailVerificationEntity &&
      new Date() <= emailVerificationEntity.expiredAt
    ) {
      throw new AppError(ErrorResponseData.FLOW_INCORRECT);
    }
    if (emailVerificationEntity) {
      await this.mailVerificationRepository.remove(emailVerificationEntity);
    }

    const token = this.tokenService.signToken({
      email: body.email,
    });

    const newEmailVerification = this.mailVerificationRepository.create({
      email: body.email,
      token: token,
      expiredAt: DateTimeUtil.plusTime(new Date(), { minutes: 1, seconds: 30 }),
    });

    await this.mailVerificationRepository.save(newEmailVerification);

    this.notificationClient.emit<any, SendEmailVerificationData>(
      KAFKA_SEND_CODE_TOPIC,
      {
        email: body.email,
        token: token,
        type: 'token',
      },
    );
  }

  async updatePassword(body: UpdatePasswordRequest): Promise<void> {
    const accountEntity = await this.accountRepository.findOneBy({
      id: body.accountId,
    });

    if (!accountEntity) {
      throw new AppError(ErrorResponseData.ACCOUNT_NOT_FOUND);
    }
    if (!(await bcrypt.compare(body.oldPassword, accountEntity.password))) {
      throw new AppError(ErrorResponseData.CREDENTIAL_WRONG);
    }

    accountEntity.password = await bcrypt.hash(
      body.newPassword,
      this.sharedService.env.SALT_PASSWORD,
    );
    await this.accountRepository.save(accountEntity);
  }
  async registerAccount(body: RegisterAccountRequest) {
    console.log(
      '🚀 ~ AuthService ~ registerAccount ~ body:',
      body,
      dateFromString(body.birthDate),
    );
    const accountEntity: AccountEntity = await this.commandBus.execute(
      new CreateAccountCommand(
        body.email,
        body.password,
        body.firstName,
        body.lastName,
      ),
    );

    const { profileId } = await this.commandBus.execute(
      new CreateProfileCommand(
        body.email,
        body.firstName,
        body.lastName,
        accountEntity.id,
        dateFromString(body.birthDate),
        body.gender as Gender,
      ),
    );
    await this.commandBus.execute(
      new UpdateProfileIdAccountAndSendTokenCommand(body.email, profileId),
    );
  }

  async verifyJwt(body: VerifyJwtRequest): Promise<VerifyJwtData> {
    const data = await this.commandBus.execute(
      new VerifyJwtCommand(body.token),
    );

    return data;
  }

  async loginAccount(body: LoginAccountRequest) {
    const accountEntity = await this.accountRepository.findOneBy({
      username: body.username,
    });
    if (
      !accountEntity ||
      !(await bcrypt.compare(body.password, accountEntity.password))
    ) {
      throw new AppError(ErrorResponseData.CREDENTIAL_WRONG);
    }
    if (!accountEntity.isVerified) {
      throw new AppError(ErrorResponseData.VERIFICATION_WRONG);
    }

    const payload = {
      id: accountEntity.profileId,
      email: accountEntity.username,
    };
    const accessToken = this.tokenService.signAccessToken(payload);
    const refreshToken = this.tokenService.signAccessToken(payload);

    return {
      profileId: accountEntity.profileId,
      accessToken,
      refreshToken,
    };
  }
}
