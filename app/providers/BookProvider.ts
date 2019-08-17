import firebase from 'firebase/app';
import { OrderedMap } from 'immutable';
import { IBookProvider } from 'lists-core/boundaries/IBookProvider';
import { Book, IBook } from 'lists-core/domain';
import { BaseType } from 'lists-core/domain/Book';
import { AppStoreProvider } from './AppStoreProvider';

export class BookProvider implements IBookProvider {
  private static collection = 'books';

  private static docToBook(data: firebase.firestore.DocumentData): Book {
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
    return book;
  }

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

  public async listBook(
    cursor: firebase.firestore.QueryDocumentSnapshot | null,
    type?: BaseType,
    limit: number = 2,
  ): Promise<[OrderedMap<string, IBook> | null, any]> {

    let request = this.store.collection(BookProvider.collection).limit(limit);
    if (type) { request = request.where('type', '==', type); }
    if (cursor) { request = request.startAfter(cursor); }
    const books: firebase.firestore.QuerySnapshot = await request.get();

    let collections: OrderedMap<string, IBook> = OrderedMap();

    books.forEach((doc) => {
      const book = BookProvider.docToBook(doc.data());
      collections = collections.set(doc.id, book);
    });

    const last = books.docs[books.docs.length - 1] || null;

    return [collections, last];
  }

  public async getBookById(id: string): Promise<Book | null> {
    const book: firebase.firestore.DocumentSnapshot =
      await this.store.collection(BookProvider.collection).doc(id).get();
    if (book.exists) {
      const data = book.data();
      if (data) {
        return BookProvider.docToBook(data);
      }
    }
    return null;
  }
}
