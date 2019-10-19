import { BaseListType, BookList } from 'lists-core/domain';

export interface IBookListProvider {
  listBook(userId: string, cursor: any, type?: BaseListType, limit?: number): Promise<any>;
  getBookById(id: string): Promise<any>;
  addBook(bookList: BookList, id?: string): Promise<any>;
}
