import { AddBookInteractor } from 'lists-core/useCases/AddBookInteractor';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { BookProvider } from '~/providers';

export const appName = 'lists';
export const moduleName = 'book';

// Actions
export const ADD_BOOK_REQUEST = `${appName}/${moduleName}/ADD_BOOK_REQUEST`;
export const ADD_BOOK_SUCCESS = `${appName}/${moduleName}/ADD_BOOK_SUCCESS`;
export const ADD_BOOK_ERROR = `${appName}/${moduleName}/ADD_BOOK_ERROR`;

export const bookReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    default:
      return state;
  }
};

interface IAddBookActionType {
  type: string;
  payload: any;
}

// Actions Creators
export function addBookAction(book: any): IAddBookActionType {
  return {
    type: ADD_BOOK_REQUEST,
    payload: book,
  };
}

export function addBookSuccess(book: any) {
  return {
    type: ADD_BOOK_SUCCESS,
    payload: book,
  };
}

export function addBookError(error: any) {
  return {
    type: ADD_BOOK_ERROR,
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
    yield put(addBookSuccess(book));
  } catch (error) {
    yield put(addBookError(error));
  }
}

export function* bookSaga() {
  yield all([
    takeEvery(ADD_BOOK_REQUEST, addBookSaga),
  ]);
}
