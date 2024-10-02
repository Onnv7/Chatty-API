import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {
  KAFKA_NOTIFICATION_SERVER_CLIENT_ID,
  KAFKA_NOTIFICATION_SERVER_GROUP_ID,
} from './constants';
import { RedisModuleAsyncOptions } from '@nestjs-modules/ioredis';

@Injectable()
export class SharedService {
  public env = {
    USER_SERVER_URL: '',
    AUTH_SERVER_URL: '',
    CHAT_SERVER_URL: '',
    DROP_SCHEMA_USER: false,
    DROP_SCHEMA_AUTH: false,
    SALT_PASSWORD: 7,
    KAFKA_BROKER: '',
    MAIL_HOST: '',
    MAIL_USER: '',
    MAIL_PASSWORD: '',
    MAIL_FROM: '',
    MAIN_TRANSPORT: '',
    REDIS_HOST: '',
    REDIS_PORT: 6543,
  };
  constructor(private readonly configService: ConfigService) {
    this.env = {
      USER_SERVER_URL: this.configService.get('USER_SERVER_URL'),
      AUTH_SERVER_URL: this.configService.get('AUTH_SERVER_URL'),
      CHAT_SERVER_URL: this.configService.get('CHAT_SERVER_URL'),
      DROP_SCHEMA_USER:
        Number(this.configService.get('DROP_SCHEMA_USER')) === 1 ? true : false,
      DROP_SCHEMA_AUTH:
        Number(this.configService.get('DROP_SCHEMA_AUTH')) === 1 ? true : false,
      SALT_PASSWORD: Number(this.configService.get('SALT_PASSWORD')),
      KAFKA_BROKER: this.configService.get('KAFKA_BROKER'),
      MAIL_HOST: this.configService.get('MAIL_HOST'),
      MAIL_USER: this.configService.get('MAIL_USER'),
      MAIL_PASSWORD: this.configService.get('MAIL_PASSWORD'),
      MAIL_FROM: this.configService.get('MAIL_FROM'),
      MAIN_TRANSPORT: this.configService.get('MAIN_TRANSPORT'),
      REDIS_HOST: this.configService.get('REDIS_HOST'),
      REDIS_PORT: Number(this.configService.get('REDIS_PORT')),
    };
  }

  getGRPCServerConfig(packageName: string, pathFile: string, url: string) {
    return {
      transport: Transport.GRPC,
      options: {
        url: url,
        protoPath: pathFile,
        package: packageName,
      },
    };
  }

  getGRPCClientConfig(packageName: string, pathFile: string, url: string) {
    return {
      transport: Transport.KAFKA,
      options: {
        url: url,
        package: packageName,
        protoPath: pathFile,
      },
    };
  }

  getKafkaConfigServer(
    clientId: string,
    groupId: string,
    kafkaBroker: string[],
  ) {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: clientId,
          brokers: kafkaBroker,
        },
        consumer: {
          groupId: groupId,
        },
      },
    };
  }

  getRedisConfig(): RedisModuleAsyncOptions {
    return {
      useFactory: async () => ({
        type: 'single',
        url: 'redis://localhost:6379',
        options: {
          db: 0,
        },
      }),
    };
  }
}
