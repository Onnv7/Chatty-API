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
}
