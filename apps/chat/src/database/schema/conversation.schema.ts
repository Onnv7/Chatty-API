import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, unique: true })
  memberIdList: number[];

  @Prop({ name: 'last_message' })
  lastMessage: string;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
