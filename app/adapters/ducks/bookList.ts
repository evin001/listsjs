import { BaseListType, Book, IBook } from 'lists-core/domain';
import { BookListInteractor } from 'lists-core/useCases';
import { Reducer } from 'redux';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { BookListProvider } from '~/providers';
import { appName, moduleName } from '../constants';
import { errorActions } from './error';
import { loaderActions } from './loader';
import { notificationActions, NotificationType } from './notification';

// Actions
export const GET_BOOK_LIST_REQUEST = `${appName}/${moduleName}/GET_BOOK_LIST_REQUEST`;
export const GET_BOOK_LIST_SUCCESS = `${appName}/${moduleName}/GET_BOOK_LIST_SUCCESS`;
export const GET_BOOK_LIST_RESET = `${appName}/${moduleName}/GET_BOOK_LIST_RESET`;

export type BookListFilterType  = BaseListType | null;

// Reducer

// Selectors

// Actions Creators
function getBookListAction(userRef: any, filter?: BookListFilterType, reset?: boolean) {
  return {
    type: GET_BOOK_LIST_REQUEST,
    payload: { userRef, filter, reset },
  };
}

export interface IBookListActions {
  getBookList: typeof getBookListAction;
}

export const bookListActions: IBookListActions = {
  getBookList: getBookListAction,
};

// Sagas
function* getBookListSaga(action: any) {
  const { payload: { filter, reset, userRef } } = action;
  try {
    yield put(loaderActions.loading());
    const provider = new BookListProvider();
    const interactor = new BookListInteractor(provider);

    yield call(
      [interactor, interactor.listBook],
      userRef, null, filter,
    );
  } catch (error) {
    yield put(errorActions.handle(error));
    yield put(notificationActions.showMessage(
      'Не удалось загрузить список',
      NotificationType.Error,
    ));
  } finally {
    yield put(loaderActions.loaded());
  }
}

export function* bookListSaga() {
  yield all([
    takeEvery(GET_BOOK_LIST_REQUEST, getBookListSaga),
  ]);
}
