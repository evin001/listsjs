export enum BaseType {
  Done = 'done',
  InProcess = 'in-process',
  Planned = 'planned',
}

export class Book {
  get type(): BaseType {
    return this._type;
  }

  set type(value: BaseType) {
    this.doneDate = (value !== BaseType.Done) ? null : new Date();
    this._type = value;
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

  get readingTarget(): string {
    return this._readingTarget;
  }

  set readingTarget(value: string) {
    this._readingTarget = value.substr(0, Book.readingTargetMaxLength);
  }

  get isError(): boolean {
    return this.isErrorAuthor || !this._author ||
      this.isErrorName || !this._name ||
      this.isErrorDescription || !this._description ||
      this.doneDate instanceof Date && isNaN(this.doneDate.getTime());
  }

  public static authorMaxLength = 100;
  public static nameMaxLength = 100;
  public static readingTargetMaxLength = 250;
  public static descriptionMaxLength = 1000;

  public static clone(book: Book): Book {
    const clone = new Book();

    clone.cover = book.cover;
    clone.type = book.type;
    clone.doneDate = book.doneDate;
    clone.readingTarget = book.readingTarget;

    clone._author = book._author;
    clone._description = book._description;
    clone._name = book._name;

    return clone;
  }

  public cover?: string;
  public doneDate?: Date | null;

  private _author: string | undefined = undefined;
  private _description: string | undefined = undefined;
  private _name: string | undefined = undefined;
  private _readingTarget: string = '';
  private _type: BaseType = BaseType.Planned;
}
