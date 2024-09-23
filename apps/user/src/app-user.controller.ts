import { Controller, Get } from '@nestjs/common';
import { AppUserService } from './app-user.service';

@Controller()
export class AppUserController {
  constructor(private readonly userService: AppUserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }
}
