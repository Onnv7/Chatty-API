import { Injectable } from '@nestjs/common';

@Injectable()
export class AppNotificationService {
  getHello(): string {
    return 'Hello World!';
  }
}
