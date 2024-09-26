import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MessageChain {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;
}

export const MessageChainSchema = SchemaFactory.createForClass(MessageChain);
