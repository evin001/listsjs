import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './redux/reducer';
import rootSaga from './redux/saga';

const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(sagaMiddleware);
const store = createStore(reducer, enhancer);

sagaMiddleware.run(rootSaga);

export default store;
