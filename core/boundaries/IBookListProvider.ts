import { BaseListType } from 'lists-core/domain';

export interface IBookListProvider {
  listBook(userId: string, cursor: any, type?: BaseListType, limit?: number): Promise<any>;
}
