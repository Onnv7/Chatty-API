import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schema/message.schema';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}
  async create(message: Message) {
    return await this.messageModel.create(message);
  }

  async getMessagePage(conversationId: string, page: number, size: number) {
    const [docs, totalDocs] = await Promise.all([
      this.messageModel
        .find({
          conversationId: conversationId,
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * size)
        .limit(size),
      this.messageModel.countDocuments(),
    ]);

    const totalPage = Math.ceil(totalDocs / size);

    return { totalPage, messageList: docs };
  }

  async getLastMessage(conversationId: string) {
    const lastMessage = await this.messageModel
      .find({ conversationId: conversationId })
      .sort({ createdAt: -1 })
      .limit(1)
      .exec();
    return lastMessage[0];
  }
}
