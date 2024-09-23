import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModuleOptions, JwtModuleAsyncOptions } from '@nestjs/jwt';

export default class JwtConfig {
  static getJwtModuleOptions(configService: ConfigService): JwtModuleOptions {
    return {
      global: true,
      secret: 'secret',
      signOptions: {
        expiresIn: 7 * 60 * 60 * 24,
      },
    };
  }
  static getJwtConfig(): JwtModuleAsyncOptions {
    return {
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> =>
        JwtConfig.getJwtModuleOptions(configService),
      inject: [ConfigService],
    };
  }
}
