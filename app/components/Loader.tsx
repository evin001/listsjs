import { createStyles, makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '~/frameworks';

const useStyles = makeStyles(() => createStyles({
  progress: {
    position: 'absolute',
    width: '100%',
  },
}));

type Props = { loading: boolean };

const Loader = ({ loading }: Props) => {
  if (!loading) {
    return null;
  }

  const classes = useStyles();

  return (
    <Box position="relative">
      <LinearProgress color="secondary" className={classes.progress} />
    </Box>
  );
};

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
});

export default connect(mapStateToProps)(Loader);
