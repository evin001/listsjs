import { Book, IBook } from '../domain';

export interface IBookProvider {
  addBook(book: Book): Promise<any>;
  listBook(): Promise<Map<string, IBook> | null>;
}
