import React from 'react';
import { Provider } from 'react-redux';
import 'typeface-roboto';
import store from '~/adapters';
import Root from '~/Root';
import injectSheet from '~/styles/reset';

const App = () => (
  <Provider store={store}>
    <Root />
  </Provider>
);

export default injectSheet(App);
