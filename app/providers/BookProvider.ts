import { IBookProvider } from 'lists-core/boundaries/IBookProvider';
import { Book } from 'lists-core/domain';
import { AppStoreProvider } from './AppStoreProvider';
import { bookToDoc } from './utils';

export class BookProvider implements IBookProvider {
  static collection = 'books';

  private store: import('firebase').firestore.Firestore =
    (AppStoreProvider.getInstance().getStore() as import('firebase').firestore.Firestore);

  createBook(book: Book): Promise<import('firebase').firestore.DocumentReference> {
    const collection = this.store.collection(BookProvider.collection);
    return collection.add(bookToDoc(book));
  }

  async updateBook(book: Book, id: string): Promise<import('firebase').firestore.DocumentReference> {
    const collection = this.store.collection(BookProvider.collection);
    await collection.doc(id).update(bookToDoc(book));
    return collection.doc(id);
  }
}
