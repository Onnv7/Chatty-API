// message.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { MessageActionSchema, MessageAction } from './message-reaction.schema';

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  senderId: number;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [MessageActionSchema] })
  reaction?: MessageAction[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  })
  conversationId: string;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
