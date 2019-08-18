import * as Sentry from '@sentry/browser';
import { all, takeEvery } from 'redux-saga/effects';
import { appName, moduleName } from '../constants';

// Actions
const ERROR_CONSOLE = `${appName}/${moduleName}/ERROR_CONSOLE`;

function consoleAction(error: any) {
  return {
    type: ERROR_CONSOLE,
    error,
  };
}

export interface IErrorActions {
  handle: typeof consoleAction;
}

export const errorActions: IErrorActions = {
  handle: consoleAction,
};

// Sagas
function* handleErrorSaga(action: any) {
  yield Sentry.captureException(action.error);
}

export function* errorSaga() {
  yield all([
    takeEvery(ERROR_CONSOLE, handleErrorSaga),
  ]);
}
