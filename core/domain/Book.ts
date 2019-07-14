export enum BaseType {
  Done,
  InProcess,
  Planned,
}

export class Book {
  get author(): string {
    return this._author;
  }

  set author(value: string) {
    if (value.length <= Book.authorMaxLength) {
      this._author = value;
    }
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    if (value.length <= Book.descriptionMaxLength) {
      this._description = value;
    }
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if (value.length <= Book.nameMaxLength) {
      this._name = value;
    }
  }

  get readingTarget(): string {
    return this._readingTarget;
  }

  set readingTarget(value: string) {
    if (value.length <= Book.readingTargetMaxLength) {
      this._readingTarget = value;
    }
  }

  public static clone(book: Book): Book {
    const clone = new Book();

    clone.cover = book.cover;
    clone.description = book.description;
    clone.doneDate = book.doneDate;
    clone.name = book.name;
    clone.readingTarget = book.readingTarget;
    clone.type = book.type;
    clone.author = book.author;

    return clone;
  }

  private static authorMaxLength = 100;
  private static nameMaxLength = 100;
  private static readingTargetMaxLength = 250;
  private static descriptionMaxLength = 1000;

  public cover?: string;
  public doneDate?: Date | null;
  public type: BaseType = BaseType.Planned;

  private _author: string = '';
  private _description: string = '';
  private _name: string = '';
  private _readingTarget: string = '';
}
