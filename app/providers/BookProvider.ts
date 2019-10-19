import firebase from 'firebase/app';
import { IBookProvider } from 'lists-core/boundaries/IBookProvider';
import { Book } from 'lists-core/domain';
import { AppStoreProvider } from './AppStoreProvider';
import { bookToDoc } from './utils';

export class BookProvider implements IBookProvider {
  public static collection = 'books';

  private store: firebase.firestore.Firestore =
    (AppStoreProvider.getInstance().getStore() as firebase.firestore.Firestore);

  public createBook(book: Book): Promise<firebase.firestore.DocumentReference> {
    const collection = this.store.collection(BookProvider.collection);
    return collection.add(bookToDoc(book));
  }

  public async updateBook(book: Book, id: string): Promise<firebase.firestore.DocumentReference> {
    const collection = this.store.collection(BookProvider.collection);
    await collection.doc(id).update(bookToDoc(book));
    return collection.doc(id);
  }
}
