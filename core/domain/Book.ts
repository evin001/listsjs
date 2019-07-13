enum BaseType {
  Done,
  InProcess,
  Planned,
}

export class Book {
  public readingTarget?: string;
  public author?: string[];
  public name?: string;
  public description?: string;
  public cover?: string;
  public doneDate?: Date;
  public type?: BaseType;
}
