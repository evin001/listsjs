export interface IAuthor {
  id?: string;
  name: string;
}

export class Author implements IAuthor {
  get name(): string {
    return this._name || '';
  }

  set name(value: string) {
    this._name = value.substr(0, Author.nameMaxLength);
  }

  get isError() {
    return this._name === '';
  }

  static nameMaxLength = 100;

  static clone(author: Author): Author {
    const clone = new Author();
    clone.id = author.id;
    clone.name = author.name;
    return clone;
  }

  id?: string;

  private _name: string | undefined = undefined;
}
