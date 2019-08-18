import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker , MuiPickersUtilsProvider } from '@material-ui/pickers';
import ruLocale from 'date-fns/locale/ru';
import { Book } from 'lists-core/domain';
import { BaseType, baseTypeList } from 'lists-core/domain/Book';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bookActions, bookSelector, IBookActions, ILocationActions, locationActions } from '~/adapters';
import { IStateType } from '~/frameworks';

interface ICommonProps {}

interface IBookState {
  readingTarget?: string;
  author: string;
  name: string;
  description: string;
  doneDate?: Date | null;
  type: BaseType;
}

interface IMapStateToProps {
  book?: Book;
}

interface IProps extends WithStyles<typeof styles>, IMapStateToProps, IBookActions, ILocationActions {
  match: {
    params: {
      id?: string,
      type?: BaseType,
    },
  };
}

interface IState {
  values: Book;
  isUpdateFromProps: boolean;
}

const styles = (theme: Theme) => createStyles({
  formControl: {
    margin: theme.spacing(2, 0, 1),
    minWidth: 238,
  },
  cancel: {
    marginLeft: theme.spacing(2),
  },
});

class AddBook extends PureComponent<IProps, IState> {

  public state = {
    values: new Book(),
    isUpdateFromProps: false,
  };

  public componentDidMount() {
    const { match, getBook } = this.props;

    if (match.params.id) {
      getBook(match.params.id);
    }

    if (match.params.type) {
      const cloneBook = Book.clone(this.state.values);
      cloneBook.type = match.params.type as BaseType;
      this.setState({ values: cloneBook });
    }
  }

  public componentDidUpdate() {
    const { book } = this.props;
    const { isUpdateFromProps } = this.state;
    if (book && !isUpdateFromProps) {
      this.setState({
        values: Book.clone(book),
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
            onChange={this.handleChangeInput('readingTarget')}
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
            onChange={this.handleChangeInput('author')}
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
            onChange={this.handleChangeInput('name')}
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
            onChange={this.handleChangeInput('description')}
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
          disabled={values.isError}
          variant="contained"
          color="primary"
          onClick={this.handleClickAdd}
        >
          {match.params.id ? 'Обновить' : 'Добавить'}
        </Button>
        <Button className={classes.cancel} onClick={this.handleCancel}>Отменить</Button>
      </form>
    );
  }

  private handleCancel = () => {
    this.props.redirect('/');
  }

  private handleChangeInput = (name: keyof IBookState) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const cloneBook = Book.clone(this.state.values);
      (cloneBook[name] as string) = event.target.value;
      this.setState({ values: cloneBook });
    };
  }

  private handleChangeSelect = (event: React.ChangeEvent<{ name?: string, value: unknown }>) => {
    const cloneBook = Book.clone(this.state.values);
    cloneBook.type = event.target.value as BaseType;
    this.setState({ values: cloneBook });
  }

  private handleChangeDate = (date: Date | null) => {
    const cloneBook = Book.clone(this.state.values);
    cloneBook.doneDate = date;
    this.setState({ values: cloneBook });
  }

  private handleClickAdd = () => {
    const { addBook, match } = this.props;
    addBook(this.state.values, match.params.id, '/');
  }
}

const mapStateToProps = (state: IStateType): IMapStateToProps => ({
  book: bookSelector(state.book),
});

export default connect(mapStateToProps, {
  ...bookActions,
  ...locationActions,
})(withStyles(styles)(AddBook));
