import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import React, { Fragment } from 'react';
import BaseRouter from './BaseRouter';
import Header from './Header';
import Loader from './Loader';
import Notification from './Notification';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    paddingBottom: theme.spacing(3),
  },
}));

const AppWrapper = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <CssBaseline />
      <Container maxWidth="md" classes={{ root: classes.root }}>
        <Header />
        <Loader />
        <Notification />
        <BaseRouter />
      </Container>
    </Fragment>
  );
};

export default AppWrapper;
