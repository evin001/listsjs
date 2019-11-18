import { IAuthorProvider, ISearchAuthorProvider } from 'lists-core/boundaries';
import { Author } from 'lists-core/domain';
import { AppStoreProvider } from './AppStoreProvider';
import { authorToDoc, getSearchEndCode } from './utils';

export class AuthorProvider implements IAuthorProvider, ISearchAuthorProvider {
  static collection = 'authors';

  private store: import('firebase').firestore.Firestore =
    (AppStoreProvider.getInstance().getStore() as import('firebase').firestore.Firestore);

  async setAuthor(author: Author): Promise<import('firebase').firestore.DocumentReference> {
    const collection = this.store.collection(AuthorProvider.collection);
    if (author.id) {
      await collection.doc(author.id).update(authorToDoc(author));
      return collection.doc(author.id);
    }
    return collection.add(authorToDoc(author));
  }

  async searchAuthors(needle: string): Promise<any> {
    const normalizeNeedle = needle.toLocaleLowerCase();
    const endCode = getSearchEndCode(normalizeNeedle);
    const collection = this.store.collection(AuthorProvider.collection);
    const authorsDoc = await collection
      .where('search', '>=', normalizeNeedle)
      .where('search', '<', endCode)
      .limit(10)
      .get();

    for (let i = 0; i < authorsDoc.size; i++) {
      const authorDoc = authorsDoc.docs[i];
    }

    return undefined;
  }
}
