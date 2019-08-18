import { all } from 'redux-saga/effects';
import { bookSaga, errorSaga, locationSaga } from '../ducks';

export function* rootSaga() {
  yield all([
    bookSaga(),
    locationSaga(),
    errorSaga(),
  ]);
}
