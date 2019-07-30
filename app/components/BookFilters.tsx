import { makeStyles, Theme } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { BaseType, baseTypeList } from 'lists-core/domain/Book';
import React, { useState } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'inline-flex',
    flexFlow: 'wrap',
  },
  chip: {
    margin: theme.spacing(1),
  },
}));

const BookFilters = () => {
  const classes = useStyles();
  const [type, setType] = useState();

  function handleClick(value: BaseType) {
    return () => {
      setType(type === value ? null : value);
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
