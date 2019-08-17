import { IBookProvider } from 'lists-core/boundaries/IBookProvider';
import { BaseType } from 'lists-core/domain/Book';

export class ListBookInteractor {
  constructor(private provider: IBookProvider) {}

  public listBook(cursor: any, type?: BaseType): Promise<any> {
    return this.provider.listBook(cursor, type);
  }

  public getBookById(id: string): Promise<any> {
    return this.provider.getBookById(id);
  }
}
