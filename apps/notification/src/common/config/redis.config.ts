import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
  RedisSingleOptions,
} from '@nestjs-modules/ioredis';
import { SharedService } from '../../../../../libs/shared/src';

export default class RedisConfig {
  static getConfig(sharedService: SharedService): RedisModuleOptions {
    return {
      type: 'single',
      url: `redis://${sharedService.env.REDIS_HOST}:${sharedService.env.REDIS_PORT}`,
      options: {
        db: 0,
      },
    };
  }
}
