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
import { BaseListType, baseTypeList, Book, BookList } from 'lists-core/domain';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bookListActions, IBookListActions, ILocationActions, locationActions } from '~/adapters';
import { IStateType } from '~/frameworks';

interface ICommonProps {}

interface IBookInputProps {
  author: string;
  name: string;
  description: string;
}

interface IBookListInputProps {
  readingTarget: string;
}

interface IMapStateToProps {
  bookFromList: BookList | null;
}

interface IProps extends WithStyles<typeof styles>, IMapStateToProps, IBookListActions, ILocationActions {
  match: {
    params: {
      id?: string,
      type?: BaseListType,
    },
  };
}

interface IState {
  values: BookList;
  isUpdateFromProps: boolean;
}

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

class AddBook extends PureComponent<IProps, IState> {

  public state = {
    values: new BookList(),
    isUpdateFromProps: false,
  };

  public componentDidMount() {
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

  public componentDidUpdate() {
    const { bookFromList, match } = this.props;
    const { isUpdateFromProps } = this.state;
    if (match.params.id && bookFromList && !isUpdateFromProps) {
      this.setState({
        values: BookList.clone(bookFromList),
        isUpdateFromProps: true,
      });
    }
  }

  public render() {
    const { classes, match } = this.props;
    const { values } = this.state;
    const commonProps: ICommonProps = {
      fullWidth: true,
      margin: 'normal',
    };

    return (
      <form autoComplete="off">
        <Box>
          <TextField
            label="Цель прочтения"
            value={values.readingTarget}
            onChange={this.handleChangeBookListInput('readingTarget')}
            helperText={`${values.readingTarget && values.readingTarget.length || 0}/${BookList.readingTargetMaxLength}`}
            {...commonProps}
          />
        </Box>
        <Box>
          <TextField
            required
            error={values.book.isErrorAuthor}
            label="Автор"
            value={values.book.author}
            onChange={this.handleChangeBookInput('author')}
            helperText={`${values.book.author && values.book.author.length || 0}/${Book.authorMaxLength}`}
            {...commonProps}
          />
        </Box>
        <Box>
          <TextField
            required
            error={values.book.isErrorName}
            label="Название"
            value={values.book.name}
            onChange={this.handleChangeBookInput('name')}
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
            onChange={this.handleChangeBookInput('description')}
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
                onChange={this.handleChangeDate}
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
              onChange={this.handleChangeSelect}
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
          onClick={this.handleClickAdd}
        >
          {match.params.id ? 'Обновить' : 'Добавить'}
        </Button>
        <Button
          className={clsx(classes.button, classes.cancel)}
          onClick={this.handleCancel}
        >
          Отменить
        </Button>
      </form>
    );
  }

  private handleCancel = () => {
    this.props.redirect('/');
  }

  private handleChangeBookListInput = (name: keyof IBookListInputProps) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const cloneBook = BookList.clone(this.state.values);
      (cloneBook[name] as string) = event.target.value;
      this.setState({ values: cloneBook });
    };
  }

  private handleChangeBookInput = (name: keyof IBookInputProps) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const cloneBook = BookList.clone(this.state.values);
      (cloneBook.book[name] as string) = event.target.value;
      this.setState({ values: cloneBook });
    };
  }

  private handleChangeSelect = (event: React.ChangeEvent<{ name?: string, value: unknown }>) => {
    const cloneBook = BookList.clone(this.state.values);
    cloneBook.type = event.target.value as BaseListType;
    this.setState({ values: cloneBook });
  }

  private handleChangeDate = (date: Date | null) => {
    const cloneBook = BookList.clone(this.state.values);
    cloneBook.doneDate = date;
    this.setState({ values: cloneBook });
  }

  private handleClickAdd = () => {
    const { addBook, match } = this.props;
    addBook(this.state.values, match.params.id, '/');
  }
}

const mapStateToProps = (state: IStateType): IMapStateToProps => ({
  bookFromList: state.bookList.book,
});

export default connect(mapStateToProps, {
  ...bookListActions,
  ...locationActions,
})(withStyles(styles)(AddBook));
