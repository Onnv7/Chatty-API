import { Controller } from '@nestjs/common';
import { Transport, Payload, EventPattern } from '@nestjs/microservices';
import {
  KAFKA_ADD_USER_TRACKING_ROOM_TOPIC,
  KAFKA_SEND_MESSAGE_TOPIC,
  KAFKA_SEND_REACTION_TOPIC,
} from '../../../../../libs/shared/src';
import { ConversationService } from './conversation.service';
import {
  JoinUserTrackingRoomData,
  SendNewMessageData,
  SendReactionData,
} from '../../../../../libs/shared/src/types/kafka/notification';
import { ConversationGateway } from './conversation.gateway';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly conversationGateway: ConversationGateway,
  ) {}

  @EventPattern(KAFKA_SEND_MESSAGE_TOPIC, Transport.KAFKA)
  async sendNewMessage(@Payload() data: SendNewMessageData) {
    await this.conversationGateway.sendNewMessageToClient(data);
  }

  @EventPattern(KAFKA_SEND_REACTION_TOPIC, Transport.KAFKA)
  async sendReaction(@Payload() data: SendReactionData) {
    await this.conversationGateway.sendNewReactionToClient(data);
  }

  // @EventPattern(KAFKA_ADD_USER_TRACKING_ROOM_TOPIC, Transport.KAFKA)
  // async addUserTrackingRoom(@Payload() data: AddUserTrackingRoomData) {
  //   await this.conversationGateway.addUserTrackingRoom(data);
  // }
}
