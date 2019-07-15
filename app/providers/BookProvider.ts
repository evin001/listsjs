import firebase from 'firebase/app';
import { IBookProvider } from 'lists-core/boundaries/IBookProvider';
import { Book, IBook } from 'lists-core/domain';
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

  public async listBook(): Promise<Map<string, IBook> | null> {
    const books: firebase.firestore.QuerySnapshot =
      await this.store.collection(BookProvider.collection).get();

    const collections: Map<string, IBook> = new Map();

    books.forEach((doc) => {
      const data = doc.data();

      const book = new Book();
      book.author = data.author;
      book.description = data.description;
      book.name = data.name;
      book.readingTarget = data.readingTarget;
      book.type = data.type;
      if (data.cover) { book.cover = data.cover; }
      if (data.doneDate instanceof firebase.firestore.Timestamp) {
        book.doneDate = data.doneDate.toDate();
      }

      collections.set(doc.id, book);
    });

    return collections;
  }
}
