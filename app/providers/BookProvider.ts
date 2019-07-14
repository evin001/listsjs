import firebase from 'firebase/app';
import { IBookProvider } from 'lists-core/boundaries/IBookProvider';
import { BaseType, Book } from 'lists-core/domain/Book';
import { AppStoreProvider } from './AppStoreProvider';

export class BookProvider implements IBookProvider {
  private static collection = 'books';
  private store: firebase.firestore.Firestore =
    (AppStoreProvider.getInstance().getStore() as firebase.firestore.Firestore);

  public addBook(book: Book): Promise<any> {
    return this.store.collection(BookProvider.collection).add({
      author: book.author,
      name: book.name,
      description: book.description,
      type: book.type,
      ...(book.readingTarget !== undefined ? { readingTarget: book.readingTarget } : {}),
      ...(book.cover !== undefined ? { cover: book.cover } : {}),
      ...(book.doneDate !== undefined ? { doneDate: book.doneDate } : {}),
    });
  }
}
