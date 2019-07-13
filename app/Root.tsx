import { WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import AddBook from '~/pages/AddBook';

const styles = {
  root: {
    maxWidth: 800,
    margin: '0 auto',
  },
};

interface IRootProps extends WithStyles<typeof styles> {}

const Root = ({ classes }: IRootProps) => (
  <div className={classes.root}>
    <AddBook />
  </div>
);

export default withStyles(styles)(Root);
