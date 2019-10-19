import { Book } from 'lists-core/domain/Book';

export enum BaseListType {
  Done = 'done',
  InProcess = 'in-process',
  Planned = 'planned',
}

export interface IBaseTypeList {
  key: BaseListType;
  label: string;
}

export const baseTypeList: IBaseTypeList[] = [
  { key: BaseListType.Done, label: 'Прочитанные' },
  { key: BaseListType.InProcess, label: 'Читаю' },
  { key: BaseListType.Planned, label: 'Запланированные' },
];

export interface IBookList {
  book: Book;
  doneDate?: Date | null;
  readingTarget: string;
  type: BaseListType;
  bookId?: string;
  userId?: string;
}

export class BookList implements IBookList {
  get type(): BaseListType {
    return this._type;
  }

  set type(value: BaseListType) {
    this.doneDate = (value !== BaseListType.Done) ? null : new Date();
    this._type = value;
  }

  get readingTarget(): string {
    return this._readingTarget;
  }

  set readingTarget(value: string) {
    this._readingTarget = value.substr(0, BookList.readingTargetMaxLength);
  }

  get isError(): boolean {
    return this.book.isError ||
      this.doneDate instanceof Date && isNaN(this.doneDate.getTime());
  }

  public static readingTargetMaxLength = 250;

  public static clone(bookList: BookList): BookList {
    const clone = new BookList();

    clone.book = Book.clone(bookList.book);
    clone.type = bookList.type;
    clone.doneDate = bookList.doneDate;
    clone.readingTarget = bookList.readingTarget;
    clone.bookId = bookList.bookId;
    clone.userId = bookList.userId;

    return clone;
  }

  public bookId?: string;
  public userId?: string;
  public book: Book = new Book();
  public doneDate?: Date | null;

  private _readingTarget: string = '';
  private _type: BaseListType = BaseListType.Planned;
}
