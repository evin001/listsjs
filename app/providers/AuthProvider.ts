import firebase from 'firebase/app';
import { IUserProvider } from 'lists-core/boundaries';
import { AppStoreProvider } from '~/providers/AppStoreProvider';

export class AuthProvider implements IUserProvider {
  private store: firebase.firestore.Firestore =
    (AppStoreProvider.getInstance().getStore() as firebase.firestore.Firestore);

  public async signInByEmail(email: string, password: string): Promise<string> {
    const response = await this.store.app.auth().signInWithEmailAndPassword(email, password);
    if (response.user) {
      return response.user.uid;
    }
    return '';
  }
}
