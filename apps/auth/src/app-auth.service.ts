import { Injectable } from '@nestjs/common';

@Injectable()
export class AppAuthService {
  getHello(): string {
    return 'Hello World! 1';
  }
}
