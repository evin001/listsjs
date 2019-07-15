import { IBookProvider } from 'lists-core/boundaries/IBookProvider';

export class ListBookInteractor {
  constructor(private provider: IBookProvider) {}

  public listBook(): Promise<any> {
    return this.provider.listBook();
  }
}
