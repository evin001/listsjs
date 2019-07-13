import React from 'react';
import { Provider } from 'react-redux';
import 'typeface-roboto';
import { configureStore } from '~/frameworks';
import Root from '~/Root';
import injectSheet from '~/styles/reset';

const App = () => (
  <Provider store={configureStore()}>
    <Root />
  </Provider>
);

export default injectSheet(App);
