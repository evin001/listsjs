import { Map, OrderedMap } from 'immutable';
import { BaseListType, IBookList } from 'lists-core/domain';
import { BookListInteractor } from 'lists-core/useCases';
import { Reducer } from 'redux';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { BookListProvider } from '~/providers';
import { appName, moduleName } from '../constants';
import { errorActions } from './error';
import { loaderActions } from './loader';
import { notificationActions, NotificationType } from './notification';

// Types
export type BookListFilterType  = BaseListType | null;
export type FilterType  = BaseListType | null;
export type BookListType = Map<number, OrderedMap<string, IBookList>>;

// Interfaces
export interface IBookListState {
  lastDoc: firebase.firestore.QueryDocumentSnapshot | null;
  done: boolean;
  filterType?: FilterType;
  bookList: BookListType;
}

export interface IBookListAction {
  type: string;
  payload: FilterType & IBookListState;
}

export interface IBookListActions {
  getBookList: typeof getBookListAction;
}

// Actions
export const GET_BOOK_LIST_REQUEST = `${appName}/${moduleName}/GET_BOOK_LIST_REQUEST`;
export const GET_BOOK_LIST_SUCCESS = `${appName}/${moduleName}/GET_BOOK_LIST_SUCCESS`;
export const RESET_BOOK_LIST = `${appName}/${moduleName}/RESET_BOOK_LIST`;

// Reducer
export const initialBookListState: IBookListState = {
  lastDoc: null,
  done: false,
  bookList: Map(),
};

export const bookListReducer: Reducer<IBookListState, IBookListAction> = (state = initialBookListState, action) => {
  switch (action.type) {
    case GET_BOOK_LIST_SUCCESS: {
      return {
        ...state,
        done: action.payload.lastDoc === null,
        lastDoc: action.payload.lastDoc,
        ...(action.payload.bookList.size > 0 ? {
          bookList: state.bookList.setIn([state.bookList.size], action.payload.bookList),
        } : {}),
      };
    }
    case RESET_BOOK_LIST:
      return {
        ...state,
        lastDoc: null,
        bookList: Map(),
        done: false,
        filterType: action.payload,
      };
    default:
      return state;
  }
};

// Selectors
export const rootBookListSelector = (state: any) => state.bookList;

// Actions Creators
function getBookListAction(userRef: any, filter?: BookListFilterType, reset?: boolean) {
  return {
    type: GET_BOOK_LIST_REQUEST,
    payload: { userRef, filter, reset },
  };
}

function resetBookListAction(type: FilterType) {
  return {
    type: RESET_BOOK_LIST,
    payload: type,
  };
}

function getBookListSuccessAction(bookList: Map<string, IBookList> | null, lastDoc: any) {
  return {
    type: GET_BOOK_LIST_SUCCESS,
    payload: { bookList, lastDoc },
  };
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

    let state: IBookListState = yield select(rootBookListSelector);

    if ((state.filterType || filter) && state.filterType !== filter || reset) {
      yield put(resetBookListAction(filter));
      state = yield select(rootBookListSelector);
    }

    const lastDocFromState = state.lastDoc;
    const [bookList, lastDoc] = yield call(
      [interactor, interactor.listBook],
      userRef, lastDocFromState, filter,
    );

    yield put(getBookListSuccessAction(bookList, lastDoc));
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
