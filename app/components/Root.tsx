import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import AddBook from '~/pages/AddBook';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    maxWidth: 800,
    margin: '0 auto',
    padding: theme.spacing(0, 2),
  },
}));

const Root = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AddBook />
    </div>
  );
};

export default Root;
