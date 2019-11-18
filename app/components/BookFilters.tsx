import { makeStyles, Theme } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { BaseListType, baseTypeList } from 'lists-core/domain';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'inline-flex',
    flexFlow: 'wrap',
  },
  chip: {
    margin: theme.spacing(1),
  },
}));

type Props = {
  type: BaseListType | null;
  onChangeType: (type: BaseListType) => void;
};

const BookFilters = ({ type, onChangeType }: Props) => {
  const classes = useStyles();

  function handleClick(value: BaseListType) {
    return () => {
      onChangeType(value);
    };
  }

  return (
    <div className={classes.root}>
      {baseTypeList.map((data) => (
        <Chip
          key={data.key}
          label={data.label}
          variant="outlined"
          className={classes.chip}
          color={type === data.key ? 'secondary' : 'default'}
          onClick={handleClick(data.key)}
        />
      ))}
    </div>
  );
};

export default BookFilters;
