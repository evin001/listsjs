import { BaseType } from 'lists-core/domain/Book';
import { Book } from '../domain';

export interface IBookProvider {
  addBook(book: Book, id?: string): Promise<any>;
  listBook(cursor: any, type?: BaseType, limit?: number): Promise<any>;
  getBookById(id: string): Promise<any>;
}
