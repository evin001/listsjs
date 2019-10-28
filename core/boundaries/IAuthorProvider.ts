import { Author } from '../domain';

export interface IAuthorProvider {
  setAuthor(author: Author): Promise<any>;
}
