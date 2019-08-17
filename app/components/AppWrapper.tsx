import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Loader from '~/components/Loader';
import AddBookPage from '~/pages/AddBook';
import ListBookPage from '~/pages/ListBook';
import Header from './Header';

const AppWrapper = () => {
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="md">
        <Header />
        <Loader />
        <Route exact path="/" component={ListBookPage} />
        <Route path="/add-book/:id" component={AddBookPage} />
        <Route exact path="/add-book" component={AddBookPage} />
      </Container>
    </Router>
  );
};

export default AppWrapper;
