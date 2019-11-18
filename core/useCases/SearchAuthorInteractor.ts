import { ISearchAuthorProvider } from 'lists-core/boundaries';

export class SearchAuthorInteractor implements ISearchAuthorProvider {
  constructor(private provider: ISearchAuthorProvider) {}

  searchAuthors(needle: string): Promise<any> {
    return this.provider.searchAuthors(needle);
  }
}
