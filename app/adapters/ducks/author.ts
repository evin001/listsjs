import { SearchAuthorInteractor } from 'lists-core/useCases';
import { Reducer } from 'redux';
import { all, put, takeLatest } from 'redux-saga/effects';
import { AuthorProvider } from '~/providers';
import { appName } from '../constants';
import { errorActions } from './error';
import { loaderActions } from './loader';

// Types

// Interfaces
export interface IAuthorState {
}

interface ISearchRequestAction {
  type: string;
  payload: string;
}

export interface IAuthorAction {
  type: string;
  payload: ISearchRequestAction;
}

export interface IAuthorActions {
  searchAuthors: typeof searchAuthorRequestAction;
}

export type AuthorActions = {
  searchAuthors: typeof searchAuthorRequestAction;
};

// Actions
const moduleName = 'author';

export const SEARCH_AUTHOR_REQUEST = `${appName}/${moduleName}/SEARCH_AUTHOR_REQUEST`;
export const SEARCH_AUTHOR_SUCCESS = `${appName}/${moduleName}/SEARCH_AUTHOR_SUCCESS`;

// Reducer
export const initialAuthorState: IAuthorState = {};

export const authorReducer: Reducer<IAuthorState, IAuthorAction> = (state = initialAuthorState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Selectors

// Actions Creators
function searchAuthorRequestAction(needle: string): ISearchRequestAction {
  return {
    type: SEARCH_AUTHOR_REQUEST,
    payload: needle,
  };
}

export const authorActions: IAuthorActions = {
  searchAuthors: searchAuthorRequestAction,
};

// Sagas
function* searchAuthorSaga(action: ISearchRequestAction) {
  try {
    yield put(loaderActions.loading());
    if (action.payload) {
      const provider = new AuthorProvider();
      const interactor = new SearchAuthorInteractor(provider);
      const authors = yield interactor.searchAuthors(action.payload);
    }
  } catch (error) {
    yield put(errorActions.handle(error));
  } finally {
    yield put(loaderActions.loaded());
  }
}

export function* authorSaga() {
  yield all([
    takeLatest(SEARCH_AUTHOR_REQUEST, searchAuthorSaga),
  ]);
}
