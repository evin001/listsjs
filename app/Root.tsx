import { WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import AddBook from '~/pages/AddBook';

const styles = {
  root: {
    width: 800,
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
