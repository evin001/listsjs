import * as Sentry from '@sentry/browser';
import { all, takeEvery } from 'redux-saga/effects';
import { appName, moduleName } from '../constants';

// Actions
const ERROR_CONSOLE = `${appName}/${moduleName}/ERROR_CONSOLE`;

export interface IHandleAction {
  type: string;
  error: Error;
}

function handleAction(error: Error): IHandleAction {
  return {
    type: ERROR_CONSOLE,
    error,
  };
}

export interface IErrorActions {
  handle: typeof handleAction;
}

export const errorActions: IErrorActions = {
  handle: handleAction,
};

// Sagas
function* handleErrorSaga(action: IHandleAction) {
  yield Sentry.captureException(action.error);
}

export function* errorSaga() {
  yield all([
    takeEvery(ERROR_CONSOLE, handleErrorSaga),
  ]);
}
