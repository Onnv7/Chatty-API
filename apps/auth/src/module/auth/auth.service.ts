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
  UpdatePasswordRequest,
  VerifyJwtData,
  VerifyJwtRequest,
} from '../../../../../libs/shared/src/types/auth';
import { AccountRepository } from '../../data/repository/account.repository';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../../../../../libs/token/src';
import {
  KAFKA_SEND_CODE_TOPIC,
  NOTIFICATION_SERVICE_CLIENT,
  PROFILE_SERVICE,
} from '../../../../../libs/shared/src/constants/configuration.constant';
import { AccountEntity } from '../../data/entity/account.entity';
import { CreateProfileCommand } from '../../cqrs/command/auth/RegisterAccount/create-profile/create-profile.command';
import { UpdateProfileIdAccountCommand } from '../../cqrs/command/auth/RegisterAccount/update-profile-id-account/update-profile-id-account.command';
import { VerifyJwtCommand } from '../../cqrs/command/auth/VerifyJwt/verify-jwt.cmd';
import { Gender } from '../../../../../libs/shared/src/constants/enum';
import { dateFromString } from '../../../../../libs/shared/src/util/date.util';
import { ProfileServiceClient } from '../../../../../libs/shared/src/types/user';
import { NumberUtil } from '../../../../api-gateway/src/common/util/number.util';
import { MailVerificationRepository } from '../../data/repository/mail-verification.repository';
import { DateTimeUtil } from '../../../../api-gateway/src/common/util/datetime.util';
import { ClientKafka } from '@nestjs/microservices';

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
    @Inject(NOTIFICATION_SERVICE_CLIENT)
    private readonly notificationClient: ClientKafka,
  ) {}
  async onApplicationShutdown(signal?: string) {
    await this.notificationClient.close();
  }
  async onModuleInit() {
    await this.notificationClient.connect();
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
    console.log(
      '🚀 ~ AuthService ~ sendVerificationCode ~ newEmailVerification:',
      newEmailVerification,
    );
    await this.mailVerificationRepository.save(newEmailVerification);

    const rs = await this.notificationClient
      .send(KAFKA_SEND_CODE_TOPIC, {
        email: body.email,
        code: code,
      })
      .toPromise();
    console.log('🚀 ~ AuthService ~ sendVerificationCode ~ rs:', rs);
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
      new UpdateProfileIdAccountCommand(body.email, profileId),
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
    const userEntity = { id: 1, email: 'nva@' };
    const payload = {
      id: userEntity.id,
      email: userEntity.email,
    };
    const accessToken = this.tokenService.signAccessToken(payload);
    const refreshToken = this.tokenService.signAccessToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
