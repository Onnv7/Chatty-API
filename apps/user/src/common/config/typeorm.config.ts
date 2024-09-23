import { ConfigService, ConfigModule } from '@nestjs/config';
import {
  TypeOrmModuleOptions,
  TypeOrmModuleAsyncOptions,
} from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SharedModule, SharedService } from '../../../../../libs/shared/src';

export default class TypeOrmConfig {
  static getTypeOrmModuleOptions(
    sharedService: SharedService,
  ): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: '127.0.0.1',
      port: 5433,
      username: 'root',
      password: '112233',
      database: 'chatty_user',
      // entities: [__dirname + '/../**/*.entity{.ts,.js}'], //[UserEntity], // [__dirname + '/../**/*.entity{.ts,.js}']
      autoLoadEntities: true,
      synchronize: true,
      // logging: true,
      dropSchema: sharedService.env.DROP_SCHEMA_USER,
    };
  }
  static getTypeOrmConfig() {
    return {
      imports: [SharedModule],
      useFactory: async (
        // configService: ConfigService,
        sharedService: SharedService,
      ): Promise<TypeOrmModuleOptions> => {
        return TypeOrmConfig.getTypeOrmModuleOptions(sharedService);
      },
      inject: [SharedService],
    };
  }
}
