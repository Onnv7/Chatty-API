import { Injectable } from '@nestjs/common';

export type UserContextType = {
  id: number;
  email: string;
};
export type AuthContextType = {
  user?: UserContextType;
};

@Injectable()
export class AuthContextService {
  private context: AuthContextType;

  getUser() {
    return this.context.user;
  }
  setUser(user: UserContextType) {
    if (user) this.context = { user: user };
  }
}
