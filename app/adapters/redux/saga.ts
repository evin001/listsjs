import { all } from 'redux-saga/effects';
import { authorSaga, bookListSaga, bookSaga, errorSaga, locationSaga, userSage } from '../ducks';

export function* rootSaga() {
  yield all([
    bookSaga(),
    locationSaga(),
    errorSaga(),
    userSage(),
    bookListSaga(),
    authorSaga(),
  ]);
}
