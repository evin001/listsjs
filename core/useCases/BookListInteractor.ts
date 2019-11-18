import { IBookListProvider } from 'lists-core/boundaries';
import { BaseListType, BookList } from 'lists-core/domain';

export class BookListInteractor implements IBookListProvider {
  constructor(private provider: IBookListProvider) {}

  listBook(userId: string, cursor: any, type?: BaseListType): Promise<any> {
    return this.provider.listBook(userId, cursor, type);
  }

  getBookById(id: string): Promise<any> {
    return this.provider.getBookById(id);
  }

  addBook(bookList: BookList, id?: string) {
    return this.provider.addBook(bookList, id);
  }
}
