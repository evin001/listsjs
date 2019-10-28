import { Book } from '../domain';

export interface IBookProvider {
  createBook(book: Book): Promise<any>;
  updateBook(book: Book, id: string): Promise<any>;
}
