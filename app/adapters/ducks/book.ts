import firebase from 'firebase/app';
import { Map, OrderedMap } from 'immutable';
import { IBook } from 'lists-core/domain/Book';
import { AddBookInteractor } from 'lists-core/useCases/AddBookInteractor';
import { ListBookInteractor } from 'lists-core/useCases/ListBookInteractor';
import { Reducer } from 'redux';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { BookProvider } from '~/providers';

export const appName = 'lists';
export const moduleName = 'book';

// Actions
export const ADD_BOOK_REQUEST = `${appName}/${moduleName}/ADD_BOOK_REQUEST`;
export const ADD_BOOK_SUCCESS = `${appName}/${moduleName}/ADD_BOOK_SUCCESS`;
export const ADD_BOOK_ERROR = `${appName}/${moduleName}/ADD_BOOK_ERROR`;

export const LIST_BOOK_REQUEST = `${appName}/${moduleName}/LIST_BOOK_REQUEST`;
export const LIST_BOOK_SUCCESS = `${appName}/${moduleName}/LIST_BOOK_SUCCESS`;
export const LIST_BOOK_ERROR = `${appName}/${moduleName}/LIST_BOOK_ERROR`;

export type BooksType = Map<number, OrderedMap<string, IBook>>;

export interface IListBook {
  lastDoc: firebase.firestore.QueryDocumentSnapshot | null;
  books: BooksType;
  done: boolean;
}

export interface IBookState extends IListBook {}

export const initialBookState: IBookState = {
  lastDoc: null,
  books: Map(),
  done: false,
};

export interface IBookAction {
  type: string;
  payload: IListBook;
}

export const bookReducer: Reducer<IBookState, IBookAction> = (state = initialBookState, action) => {
  switch (action.type) {
    case LIST_BOOK_SUCCESS:
      return {
        ...state,
        lastDoc: action.payload.lastDoc,
        books: state.books.setIn([state.books.size], action.payload.books),
        done: action.payload.lastDoc === null,
      };
    default:
      return state;
  }
};

// Selectors
export const rootSelector = (state: any) => state.book;
export const bookListSelector = (state: IBookState) => state.books;

// Actions Creators
export function addBookAction(book: IBook) {
  return {
    type: ADD_BOOK_REQUEST,
    payload: book,
  };
}

export function addBookSuccessAction(book: any) {
  return {
    type: ADD_BOOK_SUCCESS,
    payload: book,
  };
}

export function addBookErrorAction(error: any) {
  return {
    type: ADD_BOOK_ERROR,
    error,
  };
}

export function listBookAction(page: number) {
  return {
    type: LIST_BOOK_REQUEST,
    payload: page,
  };
}

export function listBookSuccessAction(books: Map<string, IBook> | null, lastDoc: any) {
  return {
    type: LIST_BOOK_SUCCESS,
    payload: {
      books,
      lastDoc,
    },
  };
}

export function listBookErrorAction(error: any) {
  return {
    type: LIST_BOOK_ERROR,
    error,
  };
}

// Sagas
function* addBookSaga(action: any) {
  const { payload } = action;
  try {
    const provider = new BookProvider();
    const interactor = new AddBookInteractor(provider);
    const book = yield call([interactor, interactor.addBook], payload);
    yield put(addBookSuccessAction(book));
  } catch (error) {
    yield put(addBookErrorAction(error));
  }
}

function* listBookSaga() {
  try {
    const provider = new BookProvider();
    const interactor = new ListBookInteractor(provider);
    const state: IBookState = yield select(rootSelector);
    const lastDocFromState = state.lastDoc;
    const [books, lastDoc] = yield call([interactor, interactor.listBook], lastDocFromState);
    yield put(listBookSuccessAction(books, lastDoc));
  } catch (error) {
    yield put(listBookErrorAction(error));
  }
}

export function* bookSaga() {
  yield all([
    takeEvery(ADD_BOOK_REQUEST, addBookSaga),
    takeEvery(LIST_BOOK_REQUEST, listBookSaga),
  ]);
}
