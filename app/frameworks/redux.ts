import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import {
  bookReducer, IBookState,
  ILoaderState, INotificationState,
  loaderReducer,
  notificationReducer,
  rootSaga, routerReducer,
} from '~/adapters';

export interface IStateType {
  book: IBookState;
  notification: INotificationState;
  loader: ILoaderState;
}

const rootReducer = {
  book: bookReducer,
  notification: notificationReducer,
  router: routerReducer,
  loader: loaderReducer,
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
