import firebase from 'firebase/app';
import { IUser } from 'lists-core/domain/User';
import { AuthUserInteractor } from 'lists-core/useCases';
import { Reducer } from 'redux';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { errorActions } from '~/adapters/ducks/error';
import { loaderActions } from '~/adapters/ducks/loader';
import { notificationActions, NotificationType } from '~/adapters/ducks/notification';
import { AuthProvider } from '~/providers';
import { appName, moduleName } from '../constants';

// Actions
export const SIGN_IN_USER_REQUEST = `${appName}/${moduleName}/SIGN_IN_USER_REQUEST`;
export const SIGN_IN_USER_SUCCESS = `${appName}/${moduleName}/SIGN_IN_USER_SUCCESS`;

export type UserRefType = firebase.firestore.DocumentReference | null;

export interface IUserState {
  userRef: UserRefType;
}

export interface IUserAction {
  type: string;
  payload: any;
}

// Tested user
export const initialUserState: IUserState = {
  userRef: null,
};

// Reducer
export const userReducer: Reducer<IUserState, IUserAction> = (state = initialUserState, action) => {
  switch (action.type) {
    case SIGN_IN_USER_SUCCESS:
      return {
        ...state,
        userRef: action.payload,
      };
    default:
      return state;
  }
};

// Selectors

// Actions Creators
function singInAction(user: IUser) {
  return {
    type: SIGN_IN_USER_REQUEST,
    payload: user,
  };
}

function signInSuccess(userRef: UserRefType) {
  return {
    type: SIGN_IN_USER_SUCCESS,
    payload: userRef,
  };
}

export interface IUserActions {
  signIn: typeof singInAction;
}

export const userActions: IUserActions = {
  signIn: singInAction,
};

// Sagas
function* signInSaga(action: IUserAction) {
  const { payload } = action;
  try {
    yield put(loaderActions.loading());
    const proivider = new AuthProvider();
    const interactor = new AuthUserInteractor(proivider);
    const userRef = yield call([interactor, interactor.signIn], payload);
    yield put(signInSuccess(userRef));
  } catch (error) {
    yield put(errorActions.handle(error));
    yield put(notificationActions.showMessage(
      'Не удалось инициализировать пользователя',
      NotificationType.Error,
    ));
  } finally {
    yield put(loaderActions.loaded());
  }
}

export function* userSage() {
  yield all([
    takeEvery(SIGN_IN_USER_REQUEST, signInSaga),
  ]);
}
