import { all } from 'redux-saga/effects';
import { bookSaga } from '../ducks';

export function* rootSaga() {
  yield all([
    bookSaga(),
  ]);
}
