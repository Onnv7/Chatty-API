import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { KAFKA_SEND_CODE_TOPIC } from '../../../../../libs/shared/src';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { SendEmailCodeData } from '../../../../../libs/shared/src/types/kafka/notification';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern(KAFKA_SEND_CODE_TOPIC, Transport.KAFKA)
  async sendEmail(@Payload() data: SendEmailCodeData) {
    await this.mailService.sendEmail(data);
    return true;
  }
}
