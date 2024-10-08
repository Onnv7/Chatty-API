import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ _id: true })
export class MessageAction {
  @Prop({ required: true })
  reaction: string;

  @Prop({})
  actorId?: number;
}

export const MessageActionSchema = SchemaFactory.createForClass(MessageAction);
