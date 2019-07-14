import firebase from 'firebase/app';
import { IBookProvider } from 'lists-core/boundaries/IBookProvider';
import { Book } from 'lists-core/domain/Book';
import { AppStoreProvider } from './AppStoreProvider';

export class BookProvider implements IBookProvider {
  private static collection = 'books';
  private store: firebase.firestore.Firestore =
    (AppStoreProvider.getInstance().getStore() as firebase.firestore.Firestore);

  public addBook(book: Book): Promise<any> {
    return this.store.collection(BookProvider.collection).add(book);
  }
}
