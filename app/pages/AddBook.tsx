import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker , MuiPickersUtilsProvider } from '@material-ui/pickers';
import ruLocale from 'date-fns/locale/ru';
import { BaseType } from 'lists-core/domain/Book';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(2, 0, 1),
      minWidth: 250,
    },
  }));

interface ICommonProps {}

interface IState {
  readingTarget?: string;
  author: string;
  name: string;
  description: string;
  doneDate?: Date | null;
  type: BaseType;
}

const addBook = () => {
  const classes = useStyles();
  const [values, setValues] = React.useState<IState>({
    readingTarget: '',
    author: '',
    name: '',
    description: '',
    doneDate: new Date(),
    type: BaseType.Planned,
  });
  const commonProps: ICommonProps = {
    fullWidth: true,
    margin: 'normal',
  };

  function handleChangeInput(name: keyof IState) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [name]: event.target.value });
    };
  }

  function handleChangeSelect(event: React.ChangeEvent<{ name?: string, value: unknown }>) {
    setValues({ ...values, [event.target.name as string]: event.target.value });
  }

  function handleChangeDate(date: Date | null) {
    setValues({ ...values, doneDate: date });
  }

  function handleClickAdd() {
    console.log('add book');
  }

  return (
    <form autoComplete="off">
      <Box>
        <TextField
          label="Цель прочтения"
          value={values.readingTarget}
          onChange={handleChangeInput('readingTarget')}
          {...commonProps}
        />
      </Box>
      <Box>
        <TextField
          label="Автор"
          value={values.author}
          onChange={handleChangeInput('author')}
          {...commonProps}
        />
      </Box>
      <Box>
        <TextField
          label="Название"
          value={values.name}
          onChange={handleChangeInput('name')}
          {...commonProps}
        />
      </Box>
      <Box>
        <TextField
          label="Описание"
          value={values.description}
          onChange={handleChangeInput('description')}
          multiline={true}
          rowsMax="10"
          {...commonProps}
        />
      </Box>
      {values.type === BaseType.Done && (
        <Box>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            <KeyboardDatePicker
              margin="normal"
              label="Дата прочтения"
              format="dd.MM.yyyy"
              value={values.doneDate}
              onChange={handleChangeDate}
            />
          </MuiPickersUtilsProvider>
        </Box>
      )}
      <Box>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="list-type">Список</InputLabel>
          <Select
            value={values.type}
            inputProps={{ id: 'list-type', name: 'type' }}
            onChange={handleChangeSelect}
          >
            <MenuItem value={BaseType.Done}>Прочитано</MenuItem>
            <MenuItem value={BaseType.InProcess}>Читаю</MenuItem>
            <MenuItem value={BaseType.Planned}>Запланировано</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button variant="contained" color="primary" onClick={handleClickAdd}>Добавить</Button>
    </form>
  );
};

export default addBook;
