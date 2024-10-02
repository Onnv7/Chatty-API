import { IsNotEmpty, IsNumber } from 'class-validator';

export class RegisterSocketClientRequest {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class HeartbeatRequest {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
