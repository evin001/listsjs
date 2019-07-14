import { IBookProvider } from 'lists-core/boundaries/IBookProvider';
import { Book } from 'lists-core/domain/Book';

export class AddBookInteractor {
  constructor(private provider: IBookProvider) {}

  public addBook(book: Book): Promise<any> {
    return this.provider.addBook(book);
  }
}
