import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadToken } from './types/token.type';

@Injectable()
export class TokenService extends JwtService {
  constructor(@Inject() private readonly jwtService: JwtService) {
    super();
  }

  signAccessToken(payload: PayloadToken) {
    return this.jwtService.sign(payload, {
      expiresIn: 7 * 60 * 60 * 24,
      secret: 'secret',
    });
  }

  signRefreshToken(payload: PayloadToken) {
    return this.jwtService.sign(payload, {
      expiresIn: 7 * 60 * 60 * 24,
      secret: 'secret',
    });
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verify(token, {
      secret: 'secret',
    });
  }
  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: 'secret',
    });
  }
}
