import { Book } from '../domain'

export interface IBookProvider {
  addBook (book: Book): Promise<Book>
  getBookList (): Promise<Book[]>
  updateBook (book: Book): Promise<Book>
  deleteBook (book: Book): Promise<Book>
}
