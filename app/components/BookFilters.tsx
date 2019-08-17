import { makeStyles, Theme } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { BaseType, baseTypeList } from 'lists-core/domain/Book';
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

interface IProps {
  type: BaseType | null;
  onChangeType: (type: BaseType) => void;
}

const BookFilters = ({ type, onChangeType }: IProps) => {
  const classes = useStyles();

  function handleClick(value: BaseType) {
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