import { all } from 'redux-saga/effects';
import { bookSaga, locationSaga } from '../ducks';

export function* rootSaga() {
  yield all([
    bookSaga(),
    locationSaga(),
  ]);
}
