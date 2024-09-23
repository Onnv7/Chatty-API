import { HandlebarsAdapter, MailerOptions } from '@nest-modules/mailer';
import { MailerAsyncOptions } from '@nest-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { strict } from 'assert';
import { join } from 'path';
import { config } from 'process';
import { SharedService } from '../../../../../libs/shared/src';

export default class MailerConfig {
  static getMailerOptions(sharedService: SharedService): MailerOptions {
    return {
      transport: {
        host: sharedService.env.MAIL_HOST,
        secure: false,
        auth: {
          user: sharedService.env.MAIL_USER,
          pass: sharedService.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply " <${process.env.MAIL_FROM}>`,
      },
      template: {
        dir: join(__dirname, './templates/email'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
  static getMailerAsyncOptions(): MailerAsyncOptions {
    return {
      inject: [SharedService],
      useFactory: async (
        sharedService: SharedService,
      ): Promise<MailerOptions> => MailerConfig.getMailerOptions(sharedService),
    };
  }
}
