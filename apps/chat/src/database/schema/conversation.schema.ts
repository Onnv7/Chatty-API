import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, unique: true })
  memberIdList: number[];

  @Prop({})
  lastMessage: string;

  @Prop({})
  senderId: number;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
