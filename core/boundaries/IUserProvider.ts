export interface IUserProvider {
  signInByEmail(email: string, password: string): Promise<any>;
}
