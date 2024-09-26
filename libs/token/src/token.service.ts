import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadToken, RegisterPayloadToken } from './types/token.type';

@Injectable()
export class TokenService extends JwtService {
  constructor(@Inject() private readonly jwtService: JwtService) {
    super();
  }

  signToken(payload: RegisterPayloadToken) {
    return this.jwtService.sign(payload, {
      expiresIn: 7 * 60 * 60 * 24,
      secret: 'register',
    });
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

  verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: 'register',
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
