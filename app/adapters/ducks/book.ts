import firebase from 'firebase/app';
import { Map, OrderedMap } from 'immutable';
import { BaseListType, Book, IBook } from 'lists-core/domain';
import { AddBookInteractor, ListBookInteractor } from 'lists-core/useCases';
import { Reducer } from 'redux';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { BookProvider } from '~/providers';
import { appName, moduleName } from '../constants';
import { errorActions } from './error';
import { loaderActions } from './loader';
import { locationActions } from './location';
import { notificationActions, NotificationType } from './notification';

// Actions
export const ADD_BOOK_REQUEST = `${appName}/${moduleName}/ADD_BOOK_REQUEST`;

export const LIST_BOOK_REQUEST = `${appName}/${moduleName}/LIST_BOOK_REQUEST`;
export const LIST_BOOK_SUCCESS = `${appName}/${moduleName}/LIST_BOOK_SUCCESS`;
export const LIST_BOOK_RESET = `${appName}/${moduleName}/LIST_BOOK_RESET`;

export const GET_BOOK_REQUEST = `${appName}/${moduleName}/GET_BOOK_REQUEST`;
export const GET_BOOK_SUCCESS = `${appName}/${moduleName}/GET_BOOK_SUCCESS`;

export type BooksType = Map<number, OrderedMap<string, IBook>>;

export interface IListBook {
  lastDoc: firebase.firestore.QueryDocumentSnapshot | null;
  books: BooksType;
  done: boolean;
  filterType?: FilterType;
  book?: Book;
}

export interface IBookState extends IListBook {}

export const initialBookState: IBookState = {
  lastDoc: null,
  books: Map(),
  done: false,
};

export type FilterType  = BaseListType | null;

export interface IBookAction {
  type: string;
  payload: IListBook & FilterType & Book;
}

// Reducer
export const bookReducer: Reducer<IBookState, IBookAction> = (state = initialBookState, action) => {
  switch (action.type) {
    case LIST_BOOK_SUCCESS: {
      return {
        ...state,
        done: action.payload.lastDoc === null,
        lastDoc: action.payload.lastDoc,
        ...(action.payload.books.size > 0 ? {
          books: state.books.setIn([state.books.size], action.payload.books),
        } : {}),
      };
    }
    case LIST_BOOK_RESET:
      return {
        ...state,
        lastDoc: null,
        books: Map(),
        done: false,
        filterType: action.payload,
      };
    case GET_BOOK_SUCCESS:
      return {
        ...state,
        book: action.payload,
      };
    default:
      return state;
  }
};

// Selectors
export const rootSelector = (state: any) => state.book;

// Actions Creators
function addBookAction(book: IBook, id?: string, uri?: string) {
  return {
    type: ADD_BOOK_REQUEST,
    payload: { book, id, uri },
  };
}

function getListBookAction(filter?: FilterType, reset?: boolean) {
  return {
    type: LIST_BOOK_REQUEST,
    payload: { filter, reset },
  };
}

function getBookAction(id: string) {
  return {
    type: GET_BOOK_REQUEST,
    payload: id,
  };
}

function getListBookSuccessAction(books: Map<string, IBook> | null, lastDoc: any) {
  return {
    type: LIST_BOOK_SUCCESS,
    payload: {
      books,
      lastDoc,
    },
  };
}

function resetListBookAction(type: FilterType) {
  return {
    type: LIST_BOOK_RESET,
    payload: type,
  };
}

function getBookSuccessAction(book: IBook) {
  return {
    type: GET_BOOK_SUCCESS,
    payload: book,
  };
}

export interface IBookActions {
  addBook: typeof addBookAction;
  getListBook: typeof getListBookAction;
  getBook: typeof getBookAction;
}

export const bookActions: IBookActions = {
  addBook: addBookAction,
  getListBook: getListBookAction,
  getBook: getBookAction,
};

// Sagas
function* addBookSaga(action: any) {
  const { payload } = action;
  try {
    yield put(loaderActions.loading());
    const provider = new BookProvider();
    const interactor = new AddBookInteractor(provider);
    yield call([interactor, interactor.addBook], payload.book, payload.id);
    yield put(notificationActions.showMessage(
      payload.id ? 'Книга обновлена' : 'Книга добавлена',
      NotificationType.Success,
    ));
    if (payload.uri) {
      yield put(locationActions.redirect(payload.uri));
    }
  } catch (error) {
    yield put(errorActions.handle(error));
    yield put(notificationActions.showMessage(
      payload.id ? 'Не удалось обновить книгу' : 'Не удалось добавить книгу',
      NotificationType.Error,
    ));
  } finally {
    yield put(loaderActions.loaded());
  }
}

function* listBookSaga(action: any) {
  const { payload: { filter, reset } } = action;
  try {
    yield put(loaderActions.loading());
    const provider = new BookProvider();
    const interactor = new ListBookInteractor(provider);

    let state: IBookState = yield select(rootSelector);

    if ((state.filterType || filter) && state.filterType !== filter || reset) {
      yield put(resetListBookAction(filter));
      state = yield select(rootSelector);
    }

    const lastDocFromState = state.lastDoc;
    const [books, lastDoc] = yield call(
      [interactor, interactor.listBook],
      lastDocFromState, filter,
    );
    yield put(getListBookSuccessAction(books, lastDoc));
  } catch (error) {
    yield put(errorActions.handle(error));
  } finally {
    yield put(loaderActions.loaded());
  }
}

function* getBookByIdSaga(action: any) {
  const { payload } = action;
  try {
    yield put(loaderActions.loading());
    const provider = new BookProvider();
    const interactor = new ListBookInteractor(provider);
    const book = yield call([interactor, interactor.getBookById], payload);
    yield put(getBookSuccessAction(book));
  } catch (error) {
    yield put(errorActions.handle(error));
  } finally {
    yield put(loaderActions.loaded());
  }
}

export function* bookSaga() {
  yield all([
    takeEvery(ADD_BOOK_REQUEST, addBookSaga),
    takeEvery(LIST_BOOK_REQUEST, listBookSaga),
    takeEvery(GET_BOOK_REQUEST, getBookByIdSaga),
  ]);
}
