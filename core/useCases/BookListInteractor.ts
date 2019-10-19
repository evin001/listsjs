import { IBookListProvider } from 'lists-core/boundaries';
import { BaseListType, BookList } from 'lists-core/domain';

export class BookListInteractor implements IBookListProvider {
  constructor(private provider: IBookListProvider) {}

  public listBook(userId: string, cursor: any, type?: BaseListType): Promise<any> {
    return this.provider.listBook(userId, cursor, type);
  }

  public getBookById(id: string): Promise<any> {
    return this.provider.getBookById(id);
  }

  public addBook(bookList: BookList, id: string) {
    return this.provider.addBook(bookList, id);
  }
}
