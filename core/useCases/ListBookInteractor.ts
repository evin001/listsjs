import { IBookProvider } from 'lists-core/boundaries/IBookProvider';
import { BaseListType } from 'lists-core/domain';

export class ListBookInteractor {
  constructor(private provider: IBookProvider) {}

  public listBook(cursor: any, type?: BaseListType): Promise<any> {
    return this.provider.listBook(cursor, type);
  }

  public getBookById(id: string): Promise<any> {
    return this.provider.getBookById(id);
  }
}
