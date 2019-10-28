import firebase from 'firebase/app';
import { IAuthorProvider } from 'lists-core/boundaries';
import { Author } from 'lists-core/domain';
import { AppStoreProvider } from './AppStoreProvider';
import { authorToDoc } from './utils';

export class AuthorProvider implements IAuthorProvider {
  public static collection = 'authors';

  private store: firebase.firestore.Firestore =
    (AppStoreProvider.getInstance().getStore() as firebase.firestore.Firestore);

  public async setAuthor(author: Author): Promise<firebase.firestore.DocumentReference> {
    const collection = this.store.collection(AuthorProvider.collection);
    if (author.id) {
      await collection.doc(author.id).update(authorToDoc(author));
      return collection.doc(author.id);
    }
    return collection.add(authorToDoc(author));
  }
}
