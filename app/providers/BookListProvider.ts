import firebase from 'firebase/app';
import { IBookListProvider } from 'lists-core/boundaries';
import { BaseListType } from 'lists-core/domain/BookList';
import { AppStoreProvider } from '~/providers/AppStoreProvider';

export class BookListProvider implements IBookListProvider {

  private static collection = 'lists';

  private store: firebase.firestore.Firestore =
    (AppStoreProvider.getInstance().getStore() as firebase.firestore.Firestore);

  public async listBook(
    userRef: any,
    cursor: any,
    type?: BaseListType,
    limit: number = 2,
  ): Promise<any> {

    let request = await this.store.collection(BookListProvider.collection)
      .where('userId', '==', userRef)
      .limit(limit);
    if (type) { request = request.where('type', '==', type); }
    if (cursor) { request = request.startAfter(cursor); }
    const books: firebase.firestore.QuerySnapshot = await request.get();

    books.forEach(async (doc) => {
      doc.data().bookId.get().then((snapshot: firebase.firestore.DocumentSnapshot) => {
        console.log(snapshot);
      });
    });

    return undefined;
  }

}
