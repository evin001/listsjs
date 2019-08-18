import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AddBookPage from '~/pages/AddBook';
import ListBookPage from '~/pages/ListBook';

const BaseRouter = () => (
  <Switch>
    <Route exact path="/" component={ListBookPage} />
    <Route exact path="/add-book/:id" component={AddBookPage} />
    <Route exact path="/add-book/type/:type" component={AddBookPage} />
    <Route exact path="/add-book" component={AddBookPage} />
  </Switch>
);

export default BaseRouter;
