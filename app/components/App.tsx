import React from 'react';
import { Provider } from 'react-redux';
import 'typeface-roboto';
import { configureStore, initializeFirebase } from '~/frameworks';
import injectSheet from '~/styles/reset';
import Root from './Root';

initializeFirebase();

const App = () => (
  <Provider store={configureStore()}>
    <Root />
  </Provider>
);

export default injectSheet(App);
