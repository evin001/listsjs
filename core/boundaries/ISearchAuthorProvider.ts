export interface ISearchAuthorProvider {
  searchAuthors: (needle: string) => Promise<any>;
}
