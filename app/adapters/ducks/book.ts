import { IBook } from 'lists-core/domain/Book';
import { AddBookInteractor } from 'lists-core/useCases/AddBookInteractor';
import { ListBookInteractor } from 'lists-core/useCases/ListBookInteractor';
import { all, call, put, takeEvery } from 'redux-saga/effects';
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

export interface IBookState {
  readonly books: Map<string, IBook> | null;
}

export const initialBookState = {
  books: null,
};

export interface IBookAction {
  type: string;
  payload: any;
}

export const bookReducer = (state: IBookState = initialBookState, action: IBookAction) => {
  switch (action.type) {
    case LIST_BOOK_SUCCESS:
      return {
        ...state,
        books: action.payload,
      };
    default:
      return state;
  }
};

// Selectors
export const booksSelector = (state: IBookState) => state.books;

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

export function listBookAction() {
  return {
    type: LIST_BOOK_REQUEST,
  };
}

export function listBookSuccessAction(books: Map<string, IBook> | null) {
  return {
    type: LIST_BOOK_SUCCESS,
    payload: books,
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
    const books = yield call([interactor, interactor.listBook]);
    yield put(listBookSuccessAction(books));
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
