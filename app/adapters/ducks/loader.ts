import { Reducer } from 'redux';
import { appName, moduleName } from '../constants';

export type LoaderState = typeof initialState;

export interface ILoaderAction {
  type: string;
  payload: boolean;
}

const initialState = Object.freeze({ loading: false });

// Actions
const LOADER_LOADING = `${appName}/${moduleName}/LOADER_LOADING`;
const LOADER_LOADED = `${appName}/${moduleName}/LOADER_LOADED`;

// Reducer
export const loaderReducer: Reducer<LoaderState, ILoaderAction> = (state = initialState, action) => {
  switch (action.type) {
    case LOADER_LOADING:
      return {
      ...state,
      loading: true,
    };
    case LOADER_LOADED:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

// Actions Creators
function loadingAction() {
  return {
    type: LOADER_LOADING,
  };
}

function loadedAction() {
  return {
    type: LOADER_LOADED,
  };
}

export interface ILoaderActions {
  loading: typeof loadingAction;
  loaded: typeof loadedAction;
}

export const loaderActions: ILoaderActions = {
  loading: loadingAction,
  loaded: loadedAction,
};
