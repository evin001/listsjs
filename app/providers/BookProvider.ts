import firebase from 'firebase/app';
import { OrderedMap } from 'immutable';
import { IBookProvider } from 'lists-core/boundaries/IBookProvider';
import { BaseListType, Book, IBook } from 'lists-core/domain';
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

  private static bookToDoc(book: Book) {
    return {
      author: book.author,
      name: book.name,
      description: book.description,
      type: book.type,
      ...(book.readingTarget !== undefined ? { readingTarget: book.readingTarget } : {}),
      ...(book.cover !== undefined ? { cover: book.cover } : {}),
      ...(book.doneDate !== undefined ? { doneDate: book.doneDate } : {}),
    };
  }

  private store: firebase.firestore.Firestore =
    (AppStoreProvider.getInstance().getStore() as firebase.firestore.Firestore);

  public addBook(book: Book, id?: string): Promise<any> {
    const collection = this.store.collection(BookProvider.collection);
    if (id) {
      return collection.doc(id).update(BookProvider.bookToDoc(book));
    }
    return collection.add(BookProvider.bookToDoc(book));
  }

  public async listBook(
    cursor: firebase.firestore.QueryDocumentSnapshot | null,
    type?: BaseListType,
    limit: number = 2,
  ): Promise<[OrderedMap<string, IBook> | null, any]> {

    const res: firebase.firestore.QuerySnapshot =
      await this.store.collection('lists').limit(limit).get();
    res.forEach(async (doc) => {
      const bookRes = await doc.data().bookId.get();
      console.log(bookRes.data());
    });

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
