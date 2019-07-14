import React from 'react';
import { Provider } from 'react-redux';
import 'typeface-roboto';
import { configureStore } from '~/frameworks';
import injectSheet from '~/styles/reset';
import AppWrapper from './AppWrapper';

const AppPresenter = () => (
  <Provider store={configureStore()}>
    <AppWrapper />
  </Provider>
);

export default injectSheet(AppPresenter);
