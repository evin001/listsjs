export interface IDataStoreProvider {
  getStore (): Promise<any>
}
