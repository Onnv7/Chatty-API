import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import JwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.registerAsync(JwtConfig.getJwtConfig())],
  providers: [TokenService],
  exports: [TokenService, JwtModule],
})
export class TokenModule {}
