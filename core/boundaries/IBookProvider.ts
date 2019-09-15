import { BaseListType } from 'lists-core/domain';
import { Book } from '../domain';

export interface IBookProvider {
  addBook(book: Book, id?: string): Promise<any>;
  listBook(cursor: any, type?: BaseListType, limit?: number): Promise<any>;
  getBookById(id: string): Promise<any>;
}
