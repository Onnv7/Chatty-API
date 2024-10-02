import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MessageAction, MessageActionSchema } from './message-reaction.schema';

@Schema({ _id: true })
export class MessageChain {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [MessageActionSchema] })
  reaction?: MessageAction[];

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;
}

export const MessageChainSchema = SchemaFactory.createForClass(MessageChain);
