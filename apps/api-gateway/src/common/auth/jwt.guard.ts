import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { AUTH_SERVICE_CLIENT } from '../../../../../libs/shared/src/constants/configuration.constant';
import {
  AuthServiceClient,
  AUTH_SERVICE_NAME,
} from '../../../../../libs/shared/src/types/auth';

@Injectable()
export class JwtGuard implements CanActivate, OnModuleInit {
  private authServiceClient: AuthServiceClient;
  constructor(
    @Inject(AUTH_SERVICE_CLIENT) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authServiceClient =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('🚀 ~ AuthGuard ~ canActivate ~ data: 1', context.getType());
    if (context.getType() !== 'http') {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) return false;

    const authHeaderParts = (authHeader as string).split(' ');

    if (authHeaderParts.length !== 2) return false;

    const [, jwt] = authHeaderParts;
    const { success, error, data } = await lastValueFrom(
      this.authServiceClient.verifyJwt({ token: jwt }),
    );

    return success;
    // return this.authService.send({ cmd: 'verify-jwt' }, { jwt }).pipe(
    //   switchMap(({ exp }) => {
    //     if (!exp) return of(false);

    //     const TOKEN_EXP_MS = exp * 1000;

    //     const isJwtValid = Date.now() < TOKEN_EXP_MS;

    //     return of(isJwtValid);
    //   }),
    //   catchError(() => {
    //     throw new UnauthorizedException();
    //   }),
    // );
  }
}
