export interface IUser {
  id?: string;
  email?: string;
  password?: string;
  vkId?: string;
}

export class User implements IUser {
  public id?: string;
  public email?: string;
  public password?: string;
}
