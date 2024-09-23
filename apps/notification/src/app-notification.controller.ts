import { Controller, Get } from '@nestjs/common';
import { AppNotificationService } from './app-notification.service';

@Controller()
export class AppNotificationController {
  constructor(private readonly notificationService: AppNotificationService) {}

  @Get()
  getHello(): string {
    return this.notificationService.getHello();
  }
}
