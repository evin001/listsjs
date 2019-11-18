import { IUserProvider } from 'lists-core/boundaries';
import { AppStoreProvider } from '~/providers/AppStoreProvider';

export class AuthProvider implements IUserProvider {

  private static collection = 'users';

  private store: import('firebase').firestore.Firestore =
    (AppStoreProvider.getInstance().getStore() as import('firebase').firestore.Firestore);

  async signInByEmail(email: string, password: string): Promise<import('firebase').firestore.DocumentReference | null> {
    const response = await this.store.app.auth().signInWithEmailAndPassword(email, password);
    if (response.user) {
      const userResponse = await this.store.collection(AuthProvider.collection)
        .where('id', '==', response.user.uid)
        .get();
      if (!userResponse.empty) { return userResponse.docs[0].ref; }
    }
    return null;
  }
}
