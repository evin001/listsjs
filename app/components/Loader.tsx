import { createStyles, makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';
import { connect } from 'react-redux';
import { IStateType } from '~/frameworks';

const useStyles = makeStyles(() => createStyles({
  progress: {
    position: 'absolute',
    width: '100%',
  },
}));

interface IProps {
  isLoading: boolean;
}

const Loader = ({ isLoading }: IProps) => {
  if (!isLoading) {
    return null;
  }

  const classes = useStyles();

  return (
    <Box position="relative">
      <LinearProgress color="secondary" className={classes.progress} />
    </Box>
  );
};

const mapStateToProps = (state: IStateType) => ({
  isLoading: state.loader.isLoading,
});

export default connect(mapStateToProps)(Loader);
