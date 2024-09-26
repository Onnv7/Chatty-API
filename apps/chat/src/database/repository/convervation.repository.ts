import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Conversation,
  ConversationSchema,
} from '../schema/conversation.schema';

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}
  async getById(id: string) {
    const conversation = await this.conversationModel.findById(id);

    return conversation;
  }

  async getByMemberIdList(memberIdList: number[]) {
    const conversation = await this.conversationModel.findOne({
      memberIdList: { $all: memberIdList },
    });

    return conversation;
  }

  async create(data: Partial<Conversation>) {
    const conversation = await this.conversationModel.create(data);
    return conversation;
  }

  async getConversationPageById(id: number, page: number, size: number) {
    const [docs, totalDocs] = await Promise.all([
      this.conversationModel
        .find({ memberIdList: id })
        .sort({ createdAt: 1 })
        .skip((page - 1) * size)
        .limit(size),
      this.conversationModel.countDocuments(),
    ]);
    const totalPage = Math.ceil(totalDocs / size);

    return { totalPage, conversationList: docs };
  }
}
