import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import clsx from 'clsx';
import ruLocale from 'date-fns/locale/ru';
import { Author, BaseListType, baseTypeList, Book, BookList } from 'lists-core/domain';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { authorActions, AuthorActions, bookListActions, BookListActions, LocationActions, locationActions } from '~/adapters';
import AsyncAutocomplete from '~/components/AsyncAutocomplete';
import { GlobalState } from '~/frameworks';

type MapStateToProps = {
  bookFromList: BookList | null;
  user: any;
  loading: boolean;
};

type Props = {
  match: {
    params: {
      id?: string;
      type?: BaseListType;
    },
  },
  children?: never;
} & WithStyles<typeof styles> & MapStateToProps & BookListActions & LocationActions & AuthorActions;

type State = ReturnType<typeof getInitialState>;

type BookInputProps = {
  author: string;
  name: string;
  description: string;
};

type BookListInputProps = {
  readingTarget: string;
};

const getInitialState = (props: Props) => {
  const bookList = new BookList();
  if (props.user && !props.match.params.id) {
    bookList.userId = props.user.id;
  }

  return {
    values: bookList,
    isUpdateFromProps: false,
  };
};

const styles = (theme: Theme) => createStyles({
  formControl: {
    margin: theme.spacing(2, 0, 1),
    minWidth: 238,
  },
  button: {
    marginTop: theme.spacing(2),
  },
  cancel: {
    marginLeft: theme.spacing(2),
  },
});

const handleCancel = Symbol();
const handleChangeBookListInput = Symbol();
const handleChangeBookInput = Symbol();
const handleChangeSelect = Symbol();
const handleChangeDate = Symbol();
const handleClickAdd = Symbol();

class AddBook extends PureComponent<Props, State> {
  readonly state = getInitialState(this.props);

  componentDidMount() {
    const { match, getBookById } = this.props;

    if (match.params.id) {
      getBookById(match.params.id);
    }

    if (match.params.type) {
      const cloneBook = BookList.clone(this.state.values);
      cloneBook.type = match.params.type as BaseListType;
      this.setState({ values: cloneBook });
    }
  }

  componentDidUpdate() {
    const { bookFromList, match } = this.props;
    const { isUpdateFromProps } = this.state;
    if (match.params.id && bookFromList && !isUpdateFromProps) {
      this.setState({
        values: BookList.clone(bookFromList),
        isUpdateFromProps: true,
      });
    }
  }

  render() {
    const { classes, match, loading } = this.props;
    const { values } = this.state;
    const commonProps: object = {
      fullWidth: true,
      margin: 'normal',
    };

    return (
      <form autoComplete="off">
        <Box>
          <TextField
            label="Цель прочтения"
            value={values.readingTarget}
            onChange={this[handleChangeBookListInput]('readingTarget')}
            helperText={`${values.readingTarget && values.readingTarget.length || 0}/${BookList.readingTargetMaxLength}`}
            {...commonProps}
          />
        </Box>
        <Box>
          <AsyncAutocomplete
            required
            error={values.book.author.isError}
            label="Автор"
            options={[]}
            value={values.book.author.name}
            onChange={this[handleChangeBookInput]('author')}
            helperText={`${values.book.author && values.book.author.name.length || 0}/${Author.nameMaxLength}`}
            loading={loading}
            {...commonProps}
          />
        </Box>
        <Box>
          <TextField
            required
            error={values.book.isErrorName}
            label="Название"
            onChange={this[handleChangeBookInput]('name')}
            helperText={`${values.book.name && values.book.name.length || 0}/${Book.nameMaxLength}`}
            {...commonProps}
          />
        </Box>
        <Box>
          <TextField
            required
            error={values.book.isErrorDescription}
            label="Описание"
            value={values.book.description}
            onChange={this[handleChangeBookInput]('description')}
            multiline={true}
            rowsMax="10"
            helperText={`${values.book.description && values.book.description.length || 0}/${Book.descriptionMaxLength}`}
            {...commonProps}
          />
        </Box>
        {values.type === BaseListType.Done && (
          <Box>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
              <DatePicker
                margin="normal"
                label="Дата прочтения"
                format="dd.MM.yyyy"
                value={values.doneDate}
                onChange={this[handleChangeDate]}
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
              onChange={this[handleChangeSelect]}
            >
              {baseTypeList.map((data) => (
                <MenuItem key={data.key} value={data.key}>{data.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          className={classes.button}
          disabled={values.isError}
          variant="contained"
          color="primary"
          onClick={this[handleClickAdd]}
        >
          {match.params.id ? 'Обновить' : 'Добавить'}
        </Button>
        <Button
          className={clsx(classes.button, classes.cancel)}
          onClick={this[handleCancel]}
        >
          Отменить
        </Button>
      </form>
    );
  }

  [handleCancel] = () => {
    this.props.redirect('/');
  }

  [handleChangeBookListInput] = (name: keyof BookListInputProps) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const cloneBook = BookList.clone(this.state.values);
      (cloneBook[name] as string) = event.target.value;
      this.setState({ values: cloneBook });
    };
  }

  [handleChangeBookInput] = (name: keyof BookInputProps) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const cloneBook = BookList.clone(this.state.values);
      if (name !== 'author') {
        (cloneBook.book[name] as string) = event.target.value;
      } else if (name === 'author') {
        (cloneBook.book.author.name as string) = event.target.value;
        this.props.searchAuthors(event.target.value);
      }
      this.setState({ values: cloneBook });
    };
  }

  [handleChangeSelect] = (event: React.ChangeEvent<{ name?: string, value: unknown }>) => {
    const cloneBook = BookList.clone(this.state.values);
    cloneBook.type = event.target.value as BaseListType;
    this.setState({ values: cloneBook });
  }

  [handleChangeDate] = (date: Date | null) => {
    const cloneBook = BookList.clone(this.state.values);
    cloneBook.doneDate = date;
    this.setState({ values: cloneBook });
  }

  [handleClickAdd] = () => {
    const { addBook, match } = this.props;
    addBook(this.state.values, match.params.id, '/');
  }
}

const mapStateToProps = (state: GlobalState): MapStateToProps => ({
  bookFromList: state.bookList.book,
  user: state.user.userRef,
  loading: state.loader.loading,
});

export default connect(mapStateToProps, {
  ...authorActions,
  ...bookListActions,
  ...locationActions,
})(withStyles(styles)(AddBook));
