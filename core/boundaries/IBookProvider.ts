import { BaseType } from 'lists-core/domain/Book';
import { Book } from '../domain';

export interface IBookProvider {
  addBook(book: Book): Promise<any>;
  listBook(cursor: any, type?: BaseType, limit?: number): Promise<any>;
}
