export interface IBook {
   cover?: string;
   doneDate?: Date | null;
   author: string | undefined;
   description: string | undefined;
   name: string | undefined;
   shortDescription: string;
}

export class Book implements IBook {
  get shortDescription(): string {
    return this.description.substr(0, Book.shortDescriptionLength) + '...';
  }

  get author(): string {
    return this._author || '';
  }

  set author(value: string) {
    this._author = value.substr(0, Book.authorMaxLength);
  }

  get isErrorAuthor() {
    return this._author === '';
  }

  get description(): string {
    return this._description || '';
  }

  set description(value: string) {
    this._description = value.substr(0, Book.descriptionMaxLength);
  }

  get isErrorDescription(): boolean {
    return this._description === '';
  }

  get name(): string {
    return this._name || '';
  }

  set name(value: string) {
    this._name = value.substr(0, Book.nameMaxLength);
  }

  get isErrorName(): boolean {
    return this._name === '';
  }

  get isError(): boolean {
    return this.isErrorAuthor || !this._author ||
      this.isErrorName || !this._name ||
      this.isErrorDescription || !this._description;
  }

  public static authorMaxLength = 100;
  public static nameMaxLength = 100;
  public static descriptionMaxLength = 1000;
  public static shortDescriptionLength = 100;

  public static clone(book: Book): Book {
    const clone = new Book();

    clone.cover = book.cover;

    clone._author = book._author;
    clone._description = book._description;
    clone._name = book._name;

    return clone;
  }

  public cover?: string;

  private _author: string | undefined = undefined;
  private _description: string | undefined = undefined;
  private _name: string | undefined = undefined;
}
