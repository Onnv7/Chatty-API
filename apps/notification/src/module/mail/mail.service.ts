import { MailerService } from '@nest-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { SendEmailVerificationData } from '../../../../../libs/shared/src/types/kafka/notification';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(data: SendEmailVerificationData) {
    console.log('🚀 ~ MailService ~ sendEmail ~ data:', data);
    if (data.type === 'code') {
      const sendResult: SentMessageInfo = await this.mailerService.sendMail({
        to: data.email,
        template: './verify-code',
        context: {
          code: data.token,
        },
      });
    } else {
      const sendResult: SentMessageInfo = await this.mailerService.sendMail({
        to: data.email,
        template: './verify-token',
        context: {
          link: `http://localhost:8000/auth/verify-email-token?token=${data.token}`,
        },
      });
    }
  }
}
