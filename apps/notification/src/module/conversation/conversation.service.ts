import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  SendNewMessageData,
  UserActiveData,
} from '../../../../../libs/shared/src/types/kafka/notification';
import { ConversationGateway } from './conversation.gateway';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import {
  KAFKA_USER_ACTION_TOPIC,
  USER_SERVICE_CLIENT_KAFKA,
} from '../../../../../libs/shared/src';
import { ClientKafka } from '@nestjs/microservices';
import { ActiveStatus } from '../../../../../libs/shared/src/constants/enum';

@Injectable()
export class ConversationService {
  constructor(
    @Inject(USER_SERVICE_CLIENT_KAFKA)
    private readonly userClient: ClientKafka,
    @Inject(forwardRef(() => ConversationGateway))
    private readonly conversationGateway: ConversationGateway,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async sendNewMessage(data: SendNewMessageData) {
    this.conversationGateway.sendNewMessageToClient(data);
  }

  async registerClientOnline(userId: number, socketId: string) {
    this.redis.set(`${userId.toString()}:${socketId}`, '', 'EX', 60);
    this.userClient.emit<any, UserActiveData>(KAFKA_USER_ACTION_TOPIC, {
      userId: Number(userId),
      active: ActiveStatus.ONLINE,
    });
  }
  async handleHeartbeat(userId: number, socketId: string) {
    const clientSocket = (
      await this.redis.scan('0', 'MATCH', `${userId}:${socketId}`)
    )[1][0];

    if (!clientSocket) {
      return;
    }

    this.redis.set(`${userId.toString()}:${socketId}`, '', 'EX', 60);
  }
  async clientOffline(socketId: string) {
    const clientSocketList = (
      await this.redis.scan('0', 'MATCH', `*:${socketId}`)
    )[1];
    if (clientSocketList.length === 0) {
      return;
    }
    for (const key of clientSocketList) {
      await this.redis.del(key);
    }

    const parts = clientSocketList[0].split(':');
    const userId = parts.length > 1 ? parts[0] : null;

    const keys = (await this.redis.scan('0', 'MATCH', `${userId}:*`))[1];

    if (keys.length === 0) {
      this.userClient.emit<any, UserActiveData>(KAFKA_USER_ACTION_TOPIC, {
        userId: Number(userId),
        active: ActiveStatus.OFFLINE,
      });
    }
    return userId;
  }

  async getSocketId(userId: number) {
    const result = await this.redis.scan('0', 'MATCH', `${userId}:*`);
    const keys = result[1];
    const socketIdList = [];
    if (keys.length > 0) {
      for (const key of keys) {
        const parts = key.split(':');
        const socketId = parts.length > 1 ? parts[1] : null;
        if (socketId) {
          socketIdList.push(socketId);
        }
      }
    }
    return socketIdList;
  }
}
