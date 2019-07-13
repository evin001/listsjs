import DateFnsUtils from '@date-io/date-fns';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker , MuiPickersUtilsProvider } from '@material-ui/pickers';
import ruLocale from 'date-fns/locale/ru';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      display: 'block',
    },
  }));

interface ICommonProps {
  [name: string]: any;
}

const addBook = () => {
  const classes = useStyles();
  const commonProps: ICommonProps = {
    className: classes.textField,
    fullWidth: true,
    margin: 'normal',
  };

  function handleDateChange() {
  }

  return (
    <form autoComplete="off">
      <TextField label="Цель прочтения" {...commonProps} />
      <TextField label="Автор" {...commonProps} />
      <TextField label="Название" {...commonProps} />
      <TextField
        label="Описание"
        multiline={true}
        rowsMax="10"
        {...commonProps}
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
        <KeyboardDatePicker
          margin="normal"
          label="Date picker"
          value={new Date()}
          onChange={handleDateChange}
        />
      </MuiPickersUtilsProvider>
      <FormControl>
        <InputLabel htmlFor="list-type">Список</InputLabel>
        <Select inputProps={{ id: 'list-type' }}>
          <MenuItem>Done</MenuItem>
          <MenuItem>In the process</MenuItem>
          <MenuItem>Planning</MenuItem>
        </Select>
      </FormControl>
    </form>
  );
};

export default addBook;
