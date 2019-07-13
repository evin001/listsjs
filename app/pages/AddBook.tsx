import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
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
    formControl: {
      margin: theme.spacing(2, 0, 1),
      minWidth: 250,
    },
  }));

interface ICommonProps {}

const addBook = () => {
  const classes = useStyles();
  const commonProps: ICommonProps = {
    fullWidth: true,
    margin: 'normal',
  };

  function handleDateChange() {
  }

  return (
    <form autoComplete="off">
      <Box><TextField label="Цель прочтения" {...commonProps} /></Box>
      <Box><TextField label="Автор" {...commonProps} /></Box>
      <Box><TextField label="Название" {...commonProps} /></Box>
      <Box><TextField
        label="Описание"
        multiline={true}
        rowsMax="10"
        {...commonProps}
      /></Box>
      <Box>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
          <KeyboardDatePicker
            margin="normal"
            label="Date picker"
            value={new Date()}
            onChange={handleDateChange}
          />
        </MuiPickersUtilsProvider>
      </Box>
      <Box>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="list-type">Список</InputLabel>
          <Select value="" inputProps={{ id: 'list-type' }}>
            <MenuItem>Done</MenuItem>
            <MenuItem>In the process</MenuItem>
            <MenuItem>Planning</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </form>
  );
};

export default addBook;
