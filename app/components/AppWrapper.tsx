import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import AddBook from '~/pages/AddBook';

const AppWrapper = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <AddBook />
      </Container>
    </React.Fragment>
  );
};

export default AppWrapper;
