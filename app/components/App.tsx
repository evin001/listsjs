import React from 'react';
import { Provider } from 'react-redux';
import 'typeface-roboto';
import { configureStore } from '~/frameworks';
import injectSheet from '~/styles/reset';
import Root from './Root';

const App = () => (
  <Provider store={configureStore()}>
    <Root />
  </Provider>
);

export default injectSheet(App);
