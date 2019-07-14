import { Book } from '../domain';

export interface IBookProvider {
  addBook(book: Book): Promise<any>;
}
