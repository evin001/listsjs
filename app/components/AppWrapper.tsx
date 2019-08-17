import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Loader from '~/components/Loader';
import AddBookPage from '~/pages/AddBook';
import ListBookPage from '~/pages/ListBook';
import Header from './Header';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    paddingBottom: theme.spacing(3),
  },
}));

const AppWrapper = () => {
  const classes = useStyles();
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="md" classes={{ root: classes.root }}>
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
