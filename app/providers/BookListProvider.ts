import firebase from 'firebase/app';
import { OrderedMap } from 'immutable';
import { IBookListProvider } from 'lists-core/boundaries';
import { BaseListType, IBookList } from 'lists-core/domain/BookList';
import { AppStoreProvider } from '~/providers/AppStoreProvider';
import { docToBookList } from './utils';

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

}
