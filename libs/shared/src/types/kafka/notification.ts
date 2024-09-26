export class SendEmailVerificationData {
  email: string;
  token: string;
  type: 'token' | 'code';
}
