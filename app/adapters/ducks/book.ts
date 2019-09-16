import { BaseListType, Book, IBook } from 'lists-core/domain';
import { AddBookInteractor, ListBookInteractor } from 'lists-core/useCases';
import { Reducer } from 'redux';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { BookProvider } from '~/providers';
import { appName, moduleName } from '../constants';
import { errorActions } from './error';
import { loaderActions } from './loader';
import { locationActions } from './location';
import { notificationActions, NotificationType } from './notification';

// Interfaces
export interface IBookState {
  book?: Book;
}

export interface IBookAction {
  type: string;
  payload: IBookState & Book;
}

// Actions
export const ADD_BOOK_REQUEST = `${appName}/${moduleName}/ADD_BOOK_REQUEST`;

export const GET_BOOK_REQUEST = `${appName}/${moduleName}/GET_BOOK_REQUEST`;
export const GET_BOOK_SUCCESS = `${appName}/${moduleName}/GET_BOOK_SUCCESS`;

export const initialBookState: IBookState = {};

// Reducer
export const bookReducer: Reducer<IBookState, IBookAction> = (state = initialBookState, action) => {
  switch (action.type) {
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

// Actions Creators
function addBookAction(book: IBook, id?: string, uri?: string) {
  return {
    type: ADD_BOOK_REQUEST,
    payload: { book, id, uri },
  };
}

function getBookAction(id: string) {
  return {
    type: GET_BOOK_REQUEST,
    payload: id,
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
  getBook: typeof getBookAction;
}

export const bookActions: IBookActions = {
  addBook: addBookAction,
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
    takeEvery(GET_BOOK_REQUEST, getBookByIdSaga),
  ]);
}
