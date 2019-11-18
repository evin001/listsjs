import { IUserProvider } from 'lists-core/boundaries/IUserProvider';
import { IUser } from 'lists-core/domain/User';

export class AuthUserInteractor {
  constructor(private provider: IUserProvider) {}

  signIn(user: IUser): Promise<any> | null {
    if (user.email && user.password) {
      return this.provider.signInByEmail(user.email, user.password);
    }
    return null;
  }
}
