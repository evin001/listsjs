import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import AddBookPage from '~/pages/AddBook';
import ListBookPage from '~/pages/ListBook';
import Header from './Header';

const AppWrapper = () => {
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="md">
        <Header />
        <Route exact path="/" component={ListBookPage} />
        <Route path="/add-book" component={AddBookPage} />
      </Container>
    </Router>
  );
};

export default AppWrapper;
