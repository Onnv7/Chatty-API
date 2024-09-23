import { MailerService } from '@nest-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { SendEmailCodeData } from '../../../../../libs/shared/src/types/kafka/notification';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(data: SendEmailCodeData) {
    console.log('🚀 ~ MailService ~ sendEmail ~ data:', data);
    const sendResult: SentMessageInfo = await this.mailerService.sendMail({
      to: data.email,
      template: './verify-code',
      context: {
        code: data.code,
      },
    });
  }
}
