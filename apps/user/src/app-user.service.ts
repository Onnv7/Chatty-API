import { Injectable } from '@nestjs/common';

@Injectable()
export class AppUserService {
  getHello(): string {
    return 'Hello World!';
  }
}
