import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class RegisterSocketClientRequest {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  // @IsNotEmpty()
  peerId: string;
}

export class HeartbeatRequest {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export interface JoinUserTrackingRoomRequest {
  friendIdList: number[];
}
export class CallerInfo {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  peerId: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  avatarUrl: string;
}
export class InitPhoneCallRequest {
  @IsObject()
  caller: CallerInfo;

  @IsString()
  @IsNotEmpty()
  conversationId: string;
}

export class ShareCalleePeerIdRequest {
  @IsString()
  @IsNotEmpty()
  calleePeerId: string;

  @IsString()
  @IsNotEmpty()
  callerSocketId: string;
}
