import { Reducer } from 'redux';
import { appName, moduleName } from '../constants';

export enum NotificationType {
  Success = 'success',
  Error = 'error',
}

export interface INotificationState {
  message?: string;
  type?: NotificationType;
}

export interface INotificationAction {
  type: string;
  payload: any;
}

// Actions
export const SHOW_NOTIFICATION = `${appName}/${moduleName}/SHOW_NOTIFICATION`;
export const RESET_NOTIFICATION = `${appName}/${moduleName}/RESET_NOTIFICATION`;

const initialState: INotificationState = {
  message: undefined,
  type: undefined,
};

// Reducer
export const notificationReducer: Reducer<INotificationState, INotificationAction> =
  (state = initialState, action) => {
    switch (action.type) {
      case SHOW_NOTIFICATION:
        return {
          ...state,
          message: action.payload.message,
          type: action.payload.type,
        };
      case RESET_NOTIFICATION:
        return {
          ...state,
          ...initialState,
        };
      default:
        return state;
    }
  };

// Actions Creators
function showAction(message: string, type: NotificationType) {
  return {
    type: SHOW_NOTIFICATION,
    payload: { message, type },
  };
}

function resetAction() {
  return {
    type: RESET_NOTIFICATION,
  };
}

export type NotificationActions = {
  showMessage: typeof showAction;
  resetMessage: typeof resetAction;
};

export const notificationActions: NotificationActions = {
  showMessage: showAction,
  resetMessage: resetAction,
};
