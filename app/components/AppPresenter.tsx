import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import '~/assets/fonts/stylesheet.css';
import { configureStore } from '~/frameworks';
import injectSheet from '~/styles/reset';
import AppWrapper from './AppWrapper';

const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
});

const AppPresenter = () => (
  <Provider store={configureStore()}>
    <ThemeProvider theme={theme}>
      <Router>
        <AppWrapper />
      </Router>
    </ThemeProvider>
  </Provider>
);

export default injectSheet(AppPresenter);
