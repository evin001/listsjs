import { all, takeEvery } from 'redux-saga/effects';
import { history } from '~/frameworks';
import { appName, moduleName } from '../constants';

// Actions
export const LOCATION_REDIRECT = `${appName}/${moduleName}/LOCATION_REDIRECT`;

export function redirect(uri: string) {
  return {
    type: LOCATION_REDIRECT,
    payload: uri,
  };
}

export interface ILocationActions {
  redirect: typeof redirect;
}

export const locationActions: ILocationActions = {
  redirect,
};

// Sagas
function* redirectSaga(action: any) {
  yield history.push(action.payload);
}

export function* locationSaga() {
  yield all([
    takeEvery(LOCATION_REDIRECT, redirectSaga),
  ]);
}
