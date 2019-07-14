import { IBookProvider } from 'lists-core/boundaries/IBookProvider';

export class AddBookInteractor {
  constructor(private provider: IBookProvider) {}

  public addBook(book: any): Promise<any> {
    return this.provider.addBook(book);
  }
}
