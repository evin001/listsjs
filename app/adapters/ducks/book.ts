import firebase from 'firebase/app';
import { Map, OrderedMap } from 'immutable';
import { BaseType, Book, IBook } from 'lists-core/domain/Book';
import { AddBookInteractor } from 'lists-core/useCases/AddBookInteractor';
import { ListBookInteractor } from 'lists-core/useCases/ListBookInteractor';
import { Reducer } from 'redux';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { BookProvider } from '~/providers';
import { appName, moduleName } from '../constants';
import { notificationActions, NotificationType } from './notification';

// Actions
export const ADD_BOOK_REQUEST = `${appName}/${moduleName}/ADD_BOOK_REQUEST`;

export const LIST_BOOK_REQUEST = `${appName}/${moduleName}/LIST_BOOK_REQUEST`;
export const LIST_BOOK_SUCCESS = `${appName}/${moduleName}/LIST_BOOK_SUCCESS`;
export const LIST_BOOK_RESET = `${appName}/${moduleName}/LIST_BOOK_RESET`;

export const GET_BOOK_REQUEST = `${appName}/${moduleName}/GET_BOOK_REQUEST`;
export const GET_BOOK_SUCCESS = `${appName}/${moduleName}/GET_BOOK_SUCCESS`;

export const BOOK_LOADING = `${appName}/${moduleName}/BOOK_LOADING`;
export const BOOK_LOADED = `${appName}/${moduleName}/BOOK_LOADED`;
export const BOOK_ERROR = `${appName}/${moduleName}/BOOK_ERROR`;

export type BooksType = Map<number, OrderedMap<string, IBook>>;

export interface IListBook {
  lastDoc: firebase.firestore.QueryDocumentSnapshot | null;
  books: BooksType;
  done: boolean;
  isLoading: boolean;
  filterType?: FilterType;
  book?: Book;
}

export interface IBookState extends IListBook {}

export const initialBookState: IBookState = {
  lastDoc: null,
  books: Map(),
  done: false,
  isLoading: false,
};

export type FilterType  = BaseType | null;

export interface IBookAction {
  type: string;
  payload: IListBook & FilterType & Book;
}

// Reducer
export const bookReducer: Reducer<IBookState, IBookAction> = (state = initialBookState, action) => {
  switch (action.type) {
    case BOOK_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case BOOK_LOADED:
      return {
        ...state,
        isLoading: false,
      };
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
export const bookListSelector = (state: IBookState) => state.books;
export const bookSelector = (state: IBookState) => state.book;
export const isLoadingSelector = (state: IBookState) => state.isLoading;

// Actions Creators
function addBookAction(book: IBook, id?: string) {
  return {
    type: ADD_BOOK_REQUEST,
    payload: { book, id },
  };
}

function getListBookAction(filter?: FilterType) {
  return {
    type: LIST_BOOK_REQUEST,
    payload: filter,
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

function loadingBookAction() {
  return {
    type: BOOK_LOADING,
  };
}

function loadedBookAction() {
  return {
    type: BOOK_LOADED,
  };
}

function resetListBookAction(type: FilterType) {
  return {
    type: LIST_BOOK_RESET,
    payload: type,
  };
}

function setError(error: any) {
  return {
    type: BOOK_ERROR,
    error,
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
    yield put(loadingBookAction());
    const provider = new BookProvider();
    const interactor = new AddBookInteractor(provider);
    yield call([interactor, interactor.addBook], payload.book, payload.id);
    yield put(loadedBookAction());
    yield put(notificationActions.show(
      payload.id ? 'Книга обновлена' : 'Книга добавлена',
      NotificationType.Success,
    ));
  } catch (error) {
    yield put(setError(error));
    yield put(notificationActions.show(
      payload.id ? 'Не удалось обновить книгу' : 'Не удалось добавить книгу',
      NotificationType.Error,
    ));
  }
}

function* listBookSaga(action: any) {
  const { payload } = action;
  try {
    yield put(loadingBookAction());
    const provider = new BookProvider();
    const interactor = new ListBookInteractor(provider);

    let state: IBookState = yield select(rootSelector);

    if ((state.filterType || payload) && state.filterType !== payload) {
      yield put(resetListBookAction(payload));
      state = yield select(rootSelector);
    }

    const lastDocFromState = state.lastDoc;
    const [books, lastDoc] = yield call(
      [interactor, interactor.listBook],
      lastDocFromState, payload,
    );
    yield put(loadedBookAction());
    yield put(getListBookSuccessAction(books, lastDoc));
  } catch (error) {
    yield put(setError(error));
  }
}

function* getBookByIdSaga(action: any) {
  const { payload } = action;
  try {
    yield put(loadingBookAction());
    const provider = new BookProvider();
    const interactor = new ListBookInteractor(provider);
    const book = yield call([interactor, interactor.getBookById], payload);
    yield put(loadedBookAction());
    yield put(getBookSuccessAction(book));
  } catch (error) {
    yield put(setError(error));
  }
}

export function* bookSaga() {
  yield all([
    takeEvery(ADD_BOOK_REQUEST, addBookSaga),
    takeEvery(LIST_BOOK_REQUEST, listBookSaga),
    takeEvery(GET_BOOK_REQUEST, getBookByIdSaga),
  ]);
}
