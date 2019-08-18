import { Reducer } from 'redux';
import { appName, moduleName } from '../constants';

// Actions
const LOADER_LOADING = `${appName}/${moduleName}/LOADER_LOADING`;
const LOADER_LOADED = `${appName}/${moduleName}/LOADER_LOADED`;

export interface ILoaderState {
  isLoading: boolean;
}

export interface ILoaderAction {
  type: string;
  payload: boolean;
}

const initialState = {
  isLoading: false,
};

// Reducer
export const loaderReducer: Reducer<ILoaderState, ILoaderAction> = (state = initialState, action) => {
  switch (action.type) {
    case LOADER_LOADING:
      return {
      ...state,
      isLoading: true,
    };
    case LOADER_LOADED:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Actions Creators
function loading() {
  return {
    type: LOADER_LOADING,
  };
}

function loaded() {
  return {
    type: LOADER_LOADED,
  };
}

export interface ILoaderActions {
  loading: typeof loading;
  loaded: typeof loaded;
}

export const loaderActions: ILoaderActions = {
  loading,
  loaded,
};
