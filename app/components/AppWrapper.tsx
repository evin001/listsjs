import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import ListBook from '~/pages/ListBook';
// import ListBook from '~/pages/AddBook';
import Header from './Header';

const AppWrapper = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Header />
        <ListBook />
      </Container>
    </React.Fragment>
  );
};

export default AppWrapper;
