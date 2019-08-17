import { Reducer } from 'redux';
import { appName, moduleName } from './constants';

export enum NotificationType {
  Success = 'success',
  Error = 'error',
}

export interface INotificationState {
  message?: string;
  type?: NotificationType;
}

export interface IShowNotification {
  message: string;
  type: NotificationType;
}

export interface INotificationAction {
  type: string;
  payload: IShowNotification;
}

// Actions
export const SHOW_NOTIFICATION = `${appName}/${moduleName}/SHOW_NOTIFICATION`;
export const RESET_NOTIFICATION = `${appName}/${moduleName}/RESET_NOTIFICATION`;

const initialState: INotificationState = {
  message: '',
};

// Reducer
export const notificationReducer: Reducer<INotificationState, INotificationAction> =
  (state = initialState, action) => {
    switch (action.type) {
      case SHOW_NOTIFICATION:
        return {
          message: action.payload.message,
          type: action.payload.type,
        };
      case RESET_NOTIFICATION:
        return {
          message: undefined,
          type: undefined,
        };
      default:
        return state;
    }
  };

// Actions Creators
export function showNotificationAction(message: string, type: NotificationType) {
  return {
    type: SHOW_NOTIFICATION,
    payload: { message, type },
  };
}

export function resetNotificationAction() {
  return {
    type: RESET_NOTIFICATION,
  };
}
