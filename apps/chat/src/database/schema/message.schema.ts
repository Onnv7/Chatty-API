// message.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { MessageChain } from './message-chain.schema';

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  senderId: number;

  @Prop({ type: [MessageChain], required: true }) // Nhúng một mảng MessageChain
  messageChain: MessageChain[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  })
  conversationId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
