import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileIdAccountCommand } from './update-profile-id-account.command';
import { AccountRepository } from '../../../../../data/repository/account.repository';
import { MailVerificationRepository } from '../../../../../data/repository/mail-verification.repository';
import {
  AppError,
  ErrorResponseData,
  KAFKA_SEND_CODE_TOPIC,
  NOTIFICATION_SERVICE_CLIENT_KAFKA,
} from '../../../../../../../../libs/shared/src';
import { SendEmailVerificationData } from '../../../../../../../../libs/shared/src/types/kafka/notification';
import { DateTimeUtil } from '../../../../../../../api-gateway/src/common/util/datetime.util';
import { TokenService } from '../../../../../../../../libs/token/src';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@CommandHandler(UpdateProfileIdAccountCommand)
export class UpdateProfileIdAccountAndSendTokenHandler
  implements ICommandHandler<UpdateProfileIdAccountCommand>
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly mailVerificationRepository: MailVerificationRepository,
    private readonly tokenService: TokenService,
    @Inject(NOTIFICATION_SERVICE_CLIENT_KAFKA)
    private readonly notificationClient: ClientKafka,
  ) {}
  async execute(command: UpdateProfileIdAccountCommand): Promise<any> {
    const accountEntity = await this.accountRepository.findOneBy({
      username: command.email,
    });
    accountEntity.profileId = command.profileId;
    await this.accountRepository.save(accountEntity);

    const emailVerificationEntity =
      await this.mailVerificationRepository.findOneBy({
        email: command.email,
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
      email: command.email,
    });

    const newEmailVerification = this.mailVerificationRepository.create({
      email: command.email,
      token: token,
      expiredAt: DateTimeUtil.plusTime(new Date(), { minutes: 1, seconds: 30 }),
    });

    await this.mailVerificationRepository.save(newEmailVerification);

    this.notificationClient.emit<any, SendEmailVerificationData>(
      KAFKA_SEND_CODE_TOPIC,
      {
        email: command.email,
        token: token,
        type: 'token',
      },
    );
  }
}
