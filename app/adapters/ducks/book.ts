import { Book } from 'lists-core/domain';
import { Reducer } from 'redux';
import { all } from 'redux-saga/effects';

// Interfaces
export interface IBookState {
  book?: Book;
}

export interface IBookAction {
  type: string;
  payload: IBookState & Book;
}

// Actions

export const initialBookState: IBookState = {};

// Reducer
export const bookReducer: Reducer<IBookState, IBookAction> = (state = initialBookState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export interface IBookActions {}

export const bookActions: IBookActions = {};

// Sagas

export function* bookSaga() {
  yield all([]);
}
