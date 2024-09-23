import { Controller, Get } from '@nestjs/common';
import { AppChatService } from './app-chat.service';

@Controller()
export class AppChatController {
  constructor(private readonly chatService: AppChatService) {}

  @Get()
  getHello(): string {
    return this.chatService.getHello();
  }
}
