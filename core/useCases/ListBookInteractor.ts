import { IBookProvider } from 'lists-core/boundaries/IBookProvider';

export class ListBookInteractor {
  constructor(private provider: IBookProvider) {}

  public listBook(cursor: any): Promise<any> {
    return this.provider.listBook(cursor);
  }
}
