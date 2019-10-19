import firebase from 'firebase/app';
import { OrderedMap } from 'immutable';
import { IBookListProvider } from 'lists-core/boundaries';
import { BaseListType, BookList, IBookList } from 'lists-core/domain/BookList';
import { AppStoreProvider } from '~/providers/AppStoreProvider';
import { BookProvider } from './BookProvider';
import { UserProvider } from './UserProvider';
import { bookListToDoc, docToBookList } from './utils';

export class BookListProvider implements IBookListProvider {

  private static collection = 'lists';

  private store: firebase.firestore.Firestore =
    (AppStoreProvider.getInstance().getStore() as firebase.firestore.Firestore);

  public async listBook(
    userRef: any,
    cursor: any,
    type?: BaseListType,
    limit: number = 2,
  ): Promise<[OrderedMap<string, IBookList> | null, any]> {

    let request = await this.store.collection(BookListProvider.collection)
      .where('userId', '==', userRef)
      .limit(limit);
    if (type) { request = request.where('type', '==', type); }
    if (cursor) { request = request.startAfter(cursor); }
    const books: firebase.firestore.QuerySnapshot = await request.get();

    let collections: OrderedMap<string, IBookList> = OrderedMap();

    for (let i = 0; i < books.size; i++) {
      const doc = books.docs[i];
      const bookDoc: firebase.firestore.DocumentSnapshot = await doc.data().bookId.get();
      if (bookDoc.exists) {
        const bookList = docToBookList(doc.data(), bookDoc.data());
        collections = collections.set(doc.id, bookList);
      }
    }

    const last = books.docs[books.docs.length - 1] || null;

    return [collections, last];
  }

  public async getBookById(id: string): Promise<BookList | null> {
    const book: firebase.firestore.DocumentSnapshot =
      await this.store.collection(BookListProvider.collection).doc(id).get();
    if (book.exists) {
      const data = book.data();
      if (data) {
        const bookDoc: firebase.firestore.DocumentSnapshot = await data.bookId.get();
        if (bookDoc.exists) {
          return docToBookList(data, bookDoc.data());
        }
      }
    }
    return null;
  }

  public async addBook(bookList: BookList, id?: string): Promise<any> {
    const listCollection = this.store.collection(BookListProvider.collection);
    const bookCollection = this.store.collection(BookProvider.collection);
    const userCollection = this.store.collection(UserProvider.collection);

    if (id) {
      // Update list book by id
      const batch = this.store.batch();
      batch.update(listCollection.doc(id), bookListToDoc(bookList).bookList);
      batch.update(bookCollection.doc(bookList.bookId), bookListToDoc(bookList).book);
      return batch.commit();
    }

    // Create list book
    const listBookRef: firebase.firestore.DocumentReference = await listCollection.add({
      ...bookListToDoc(bookList).bookList,
      userId: userCollection.doc(bookList.userId),
    });

    return this.store.runTransaction(async (transaction) => {
      const bookProvider = new BookProvider();
      const bookRef: firebase.firestore.DocumentReference = bookList.bookId
        ? await bookProvider.updateBook(bookList.book, bookList.bookId)
        : await bookProvider.createBook(bookList.book);
      transaction.update(listBookRef, { bookId: bookRef });
    });
  }
}
