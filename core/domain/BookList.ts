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
  book: any;
  doneDate?: Date | null;
  readingTarget: string;
  type: BaseListType;
}

export class BookList {

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

  public static readingTargetMaxLength = 250;

  public book: any;
  public doneDate?: Date | null;

  private _readingTarget: string = '';
  private _type: BaseListType = BaseListType.Planned;
}
