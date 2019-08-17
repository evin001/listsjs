import firebase from 'firebase/app';
import { Map, OrderedMap } from 'immutable';
import { BaseType, IBook } from 'lists-core/domain/Book';
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
  book?: IBook;
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
  payload: IListBook & FilterType & IBook;
}

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

export function listBookAction(filter?: FilterType) {
  return {
    type: LIST_BOOK_REQUEST,
    payload: filter,
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

export function bookLoadingAction() {
  return {
    type: BOOK_LOADING,
  };
}

export function bookLoadedAction() {
  return {
    type: BOOK_LOADED,
  };
}

export function listBookResetAction(type: FilterType) {
  return {
    type: LIST_BOOK_RESET,
    payload: type,
  };
}

export function bookErrorAction(error: any) {
  return {
    type: BOOK_ERROR,
    error,
  };
}

export function getBookById(id: string) {
  return {
    type: GET_BOOK_REQUEST,
    payload: id,
  };
}

export function getBookByIdSuccess(book: IBook) {
  return {
    type: GET_BOOK_SUCCESS,
    payload: book,
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

function* listBookSaga(action: any) {
  const { payload } = action;
  try {
    yield put(bookLoadingAction());
    const provider = new BookProvider();
    const interactor = new ListBookInteractor(provider);

    let state: IBookState = yield select(rootSelector);

    if ((state.filterType || payload) && state.filterType !== payload) {
      yield put(listBookResetAction(payload));
      state = yield select(rootSelector);
    }

    const lastDocFromState = state.lastDoc;
    const [books, lastDoc] = yield call(
      [interactor, interactor.listBook],
      lastDocFromState, payload,
    );
    yield put(bookLoadedAction());
    yield put(listBookSuccessAction(books, lastDoc));
  } catch (error) {
    yield put(bookErrorAction(error));
  }
}

function* getBookByIdSaga(action: any) {
  const { payload } = action;
  try {
    yield put(bookLoadingAction());
    const provider = new BookProvider();
    const interactor = new ListBookInteractor(provider);
    const book = yield call([interactor, interactor.getBookById], payload);
    yield put(bookLoadedAction());
    yield put(getBookByIdSuccess(book));
  } catch (error) {
    yield put(bookErrorAction(error));
  }
}

export function* bookSaga() {
  yield all([
    takeEvery(ADD_BOOK_REQUEST, addBookSaga),
    takeEvery(LIST_BOOK_REQUEST, listBookSaga),
    takeEvery(GET_BOOK_REQUEST, getBookByIdSaga),
  ]);
}
