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
import { Book } from 'lists-core/domain';
import { BaseType } from 'lists-core/domain/Book';
import React from 'react';
import { connect } from 'react-redux';
import { addBookAction } from '~/adapters';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(2, 0, 1),
      minWidth: 238,
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

interface IProps {
  dispatchAddBook: (book: Book) => void;
}

const addBook = (props: IProps) => {
  const classes = useStyles();
  const [values, setValues] = React.useState<Book>(new Book());
  const commonProps: ICommonProps = {
    fullWidth: true,
    margin: 'normal',
  };

  function handleChangeInput(name: keyof IState) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const cloneBook = Book.clone(values);
      (cloneBook[name] as string) = event.target.value;
      setValues(cloneBook);
    };
  }

  function handleChangeSelect(event: React.ChangeEvent<{ name?: string, value: unknown }>) {
    const cloneBook = Book.clone(values);
    cloneBook.type = event.target.value as BaseType;
    setValues(cloneBook);
  }

  function handleChangeDate(date: Date | null) {
    const cloneBook = Book.clone(values);
    cloneBook.doneDate = date;
    setValues(cloneBook);
  }

  function handleClickAdd() {
    props.dispatchAddBook(values);
  }

  return (
    <form autoComplete="off">
      <Box>
        <TextField
          label="Цель прочтения"
          value={values.readingTarget}
          onChange={handleChangeInput('readingTarget')}
          helperText={`${values.readingTarget && values.readingTarget.length || 0}/${Book.readingTargetMaxLength}`}
          {...commonProps}
        />
      </Box>
      <Box>
        <TextField
          required
          error={values.isErrorAuthor}
          label="Автор"
          value={values.author}
          onChange={handleChangeInput('author')}
          helperText={`${values.author && values.author.length || 0}/${Book.authorMaxLength}`}
          {...commonProps}
        />
      </Box>
      <Box>
        <TextField
          required
          error={values.isErrorName}
          label="Название"
          value={values.name}
          onChange={handleChangeInput('name')}
          helperText={`${values.name && values.name.length || 0}/${Book.nameMaxLength}`}
          {...commonProps}
        />
      </Box>
      <Box>
        <TextField
          required
          error={values.isErrorDescription}
          label="Описание"
          value={values.description}
          onChange={handleChangeInput('description')}
          multiline={true}
          rowsMax="10"
          helperText={`${values.description && values.description.length || 0}/${Book.descriptionMaxLength}`}
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
      <Button
        disabled={values.isError}
        variant="contained"
        color="primary"
        onClick={handleClickAdd}
      >
        Добавить
      </Button>
    </form>
  );
};

const mapDispatchToProps = {
  dispatchAddBook: addBookAction,
};

export default connect(null, mapDispatchToProps)(addBook);
