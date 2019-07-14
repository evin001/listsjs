import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { bookReducer, rootSaga, routerReducer } from '~/adapters';

const rootReducer = {
  book: bookReducer,
  router: routerReducer,
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
