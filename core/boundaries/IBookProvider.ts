import { Book } from '../domain';

export interface IBookProvider {
  addBook(book: Book): Promise<any>;
  listBook(cursor: any, limit?: number): Promise<any>;
}
