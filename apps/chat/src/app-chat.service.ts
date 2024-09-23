import { Injectable } from '@nestjs/common';

@Injectable()
export class AppChatService {
  getHello(): string {
    return 'Hello World!';
  }
}
