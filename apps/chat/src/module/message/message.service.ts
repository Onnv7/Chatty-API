import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../../database/repository/message.repository';
import { ConversationRepository } from '../../database/repository/convervation.repository';
import { SendMessageRequest } from '../../../../../libs/shared/src/types/chat';
import { AppError, ErrorResponseData } from '../../../../../libs/shared/src';
import { Message } from '../../database/schema/message.schema';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async sendMessage(body: SendMessageRequest) {
    const conversation = await this.conversationRepository.getById(
      body.conversationId,
    );

    if (!conversation) {
      throw new AppError(ErrorResponseData.CONVERSATION_NOT_FOUND);
    } else if (
      !conversation.memberIdList.find((msg) => msg === body.senderId)
    ) {
      throw new AppError(ErrorResponseData.CONVERSATION_NOT_FOUND);
    }

    const newMessage: Message = {
      senderId: body.senderId,
      content: body.content,
    };

    await this.messageRepository.create(newMessage);

    conversation.lastMessage = body.content;
    await conversation.save();
  }
}
