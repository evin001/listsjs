export interface IUser {
  id?: string;
  email?: string;
  password?: string;
  vkId?: string;
}

export class User implements IUser {
  id?: string;
  email?: string;
  password?: string;
}
