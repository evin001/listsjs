import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import {
  authorReducer, bookListReducer,
  bookReducer, IAuthorState,
  IBookListState,
  IBookState,
  INotificationState, IUserState,
  loaderReducer, LoaderState,
  notificationReducer, rootSaga,
  routerReducer, userReducer,
} from '~/adapters';

export type GlobalState = {
  book: IBookState;
  bookList: IBookListState;
  notification: INotificationState;
  loader: LoaderState;
  user: IUserState;
  author: IAuthorState;
};

const rootReducer = {
  book: bookReducer,
  bookList: bookListReducer,
  notification: notificationReducer,
  router: routerReducer,
  loader: loaderReducer,
  user: userReducer,
  author: authorReducer,
};

export const configureStore = () => {
  const middleware = [];
  const sagaMiddleware = createSagaMiddleware();

  middleware.push(sagaMiddleware);
  if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
  }

  const enhancer = applyMiddleware(...middleware);
  const store = createStore(combineReducers(rootReducer), enhancer);

  sagaMiddleware.run(rootSaga);

  return store;
};
