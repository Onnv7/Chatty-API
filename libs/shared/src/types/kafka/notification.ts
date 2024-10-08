import { ActiveStatus as ActiveStatus } from '../../constants/enum';

export class SendEmailVerificationData {
  email: string;
  token: string;
  type: 'token' | 'code';
}

export interface SendNewMessageData {
  receiverId: number;
  senderId: number;
  conversationId: string;
  content: string;
  createdAt: string;
}

export interface SendReactionData {
  receiverId: number;
  senderId: number;
  conversationId: string;
  messageId: string;
  reactionList: string[];
  reactedCount: number;
}

export class UserActiveData {
  userId: number;
  active: ActiveStatus;
}

export interface JoinUserTrackingRoomData {
  friendIdList: number[];
}
