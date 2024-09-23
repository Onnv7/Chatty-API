import { Global, Module } from '@nestjs/common';
import { AppNotificationService } from './app-notification.service';
import { AppNotificationController } from './app-notification.controller';
import { MailModule } from './module/mail/mail.module';
import { MailerModule } from '@nest-modules/mailer';
import MailerConfig from './common/config/mailer.config';
import { SharedModule } from '../../../libs/shared/src';

@Global()
@Module({
  imports: [
    MailModule,
    SharedModule,
    MailerModule.forRootAsync(MailerConfig.getMailerAsyncOptions()),
  ],
  controllers: [AppNotificationController],
  providers: [AppNotificationService],
  exports: [SharedModule],
})
export class AppNotificationModule {}
