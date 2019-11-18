import CircularProgress from '@material-ui/core/CircularProgress';
import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import React, { Fragment, useState } from 'react';

type Props = InputProps & {
  options: Option[];
  children?: never;
};

type InputProps = StandardTextFieldProps & typeof inputDefaultProps;

type Option = {
  id: string;
  name: string;
};

const inputDefaultProps = Object.freeze({ loading: false });

const Input = ({ loading, ...props }: InputProps) => (params: RenderInputParams) => (
  <TextField
    {...params}
    {...props}
    InputProps={{
      ...params.InputProps,
      endAdornment: (
        <Fragment>
          {loading && <CircularProgress color="inherit" size={20} />}
          {params.InputProps.endAdornment}
        </Fragment>
      ),
    }}
  />
);

const AsyncAutocomplete = ({ loading, options, ...props }: Props) => {
  const [open, setOpen] = useState(false);

  function handleOpen(value: boolean) {
    return () => setOpen(value);
  }

  function handleOptionLabel(option: Option) {
    return option.name;
  }

  return (
    <Autocomplete
      open={open}
      onOpen={handleOpen(true)}
      onClose={handleOpen(false)}
      getOptionLabel={handleOptionLabel}
      options={options}
      loading={loading}
      renderInput={Input({ loading, ...props })}
    />
  );
};

export default AsyncAutocomplete;
