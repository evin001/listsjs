import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import { BaseListType } from 'lists-core/domain';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { assign, EventObject, interpret, Machine, State } from 'xstate';
import {
  bookListActions,
  BookListType, FilterType,
  IBookListActions,
  ILocationActions, locationActions, UserRefType,
} from '~/adapters';
import BookFilters from '~/components/BookFilters';
import { IStateType } from '~/frameworks';

interface IMapStateToProps {
  done: boolean;
  isLoading: boolean;
  bookList: BookListType;
  filterType?: FilterType;
  userRef: UserRefType;
}

interface IProps extends WithStyles<typeof styles>, IMapStateToProps, IBookListActions, ILocationActions {}

interface IState {
  current: State<IPageContext, PageEvent>;
}

interface IPageStateSchema {
  states: {
    active: {};
  };
}

interface IPageContext {
  page: number;
  type: FilterType;
}

type PageEvent =
  | { type: 'INC' }
  | { type: 'DEC' }
  | { type: 'OFFSET' }
  | { type: 'RESET' }
  | { type: 'FILTER'; value: FilterType, callback: any };

const increment = (context: IPageContext) => context.page + 1;
const decrement = (context: IPageContext) => context.page - 1;
const offsetPage = (context: IPageContext, event: any) => event.value - 1;
const resetPage = () => 0;
const isNotMin = (context: IPageContext) => context.page >= 0;
const selectType = (context: IPageContext) => context.type;
const selectPage = (context: IPageContext) => context.page;
const updateType = (context: IPageContext, event: EventObject) => {
  const type = context.type === event.value ? null : event.value;
  event.callback(type);
  return type;
};

const pageMachine = Machine<IPageContext, IPageStateSchema, PageEvent>({
  initial: 'active',
  context: {
    page: 0,
    type: null,
  },
  states: {
    active: {
      on: {
        INC: {
          actions: assign({ page: increment, type: selectType }),
        },
        DEC: {
          actions: assign({ page: decrement, type: selectType }),
          cond: isNotMin,
        },
        RESET: {
          actions: assign({ page: resetPage, type: selectType }),
        },
        OFFSET: {
          actions: assign({ page: offsetPage, type: selectType }),
        },
        FILTER: {
          actions: assign({ page: selectPage, type: updateType }),
        },
      },
    },
  },
});

const styles = (theme: Theme) => createStyles({
  button: {
    marginRight: theme.spacing(1),
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  control: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  addBook: {
    marginTop: theme.spacing(2),
  },
});

class ListBook extends PureComponent<IProps, IState> {

  public state = {
    current: pageMachine.initialState,
  };

  public service = interpret(pageMachine).onTransition((current) => {
    this.setState({ current });
  });

  public componentDidMount() {
    this.service.start();
    this.handleChangeType(this.props.filterType, true);
  }

  public componentDidUpdate() {
    const { done, bookList } = this.props;
    const { current } = this.state;
    if (done && bookList.size === current.context.page) {
      this.service.send('OFFSET', { value: bookList.size });
    }
  }

  public componentWillUnmount() {
    this.service.stop();
  }

  public render() {
    const { bookList, done, isLoading, classes } = this.props;
    const { current } = this.state;
    const { page, type } = current.context;
    const listBooks = bookList.get(page);

    return (
      <Box my={1}>
        <div className={classes.control}>
          <BookFilters type={type} onChangeType={this.handleChangeType} />
          <Box className={classes.pagination}>
            <IconButton
              className={classes.button}
              onClick={this.handleClickBeforePage}
              disabled={page === 0}
            >
              <NavigateBefore />
            </IconButton>
            <IconButton
              onClick={this.handleClickNextPage}
              disabled={done && page + 1 === bookList.size}
            >
              <NavigateNext />
            </IconButton>
          </Box>
        </div>

        {!isLoading && (
          <Grid container spacing={2}>
            {listBooks && listBooks.map(((value, key) => (
              <Grid item xs={6} key={key}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h2">{value.book.name}</Typography>
                    <Typography color="textSecondary">{value.book.author}</Typography>
                    <Typography variant="body2" component="p">{value.book.shortDescription}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" component={Link} to={`/add-book/${key}`}>Подробнее</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))).valueSeq().toArray()}
          </Grid>
        )}

        <Button
          className={classes.addBook}
          variant="contained"
          color="primary"
          onClick={this.handleClickAddBook}
        >
          Добавить книгу
        </Button>
      </Box>
    );
  }

  private handleClickAddBook = () => {
    const { current: { context: { type } } } = this.state;
    const uri = type ? `/add-book/type/${type}` : '/add-book';
    this.props.redirect(uri);
  }

  private handleChangeType = (value?: BaseListType | null, reset?: boolean) => {
    this.service.send([
      'RESET',
      { type: 'FILTER', value: value || null, callback: (type: FilterType) => {
          this.props.getBookList(this.props.userRef, type, reset);
        } },
    ]);
  }

  private handleClickBeforePage = () => {
    this.service.send('DEC');
  }

  private handleClickNextPage = () => {
    const { bookList, done, userRef } = this.props;
    const { current } = this.state;
    if (!(done || bookList.get(current.context.page + 1))) {
      this.props.getBookList(userRef, current.context.type);
    }
    this.service.send('INC');
  }
}

const mapStateToProps = (state: IStateType): IMapStateToProps => ({
  bookList: state.bookList.bookList,
  done: state.bookList.done,
  filterType: state.bookList.filterType,
  isLoading: state.loader.isLoading,
  userRef: state.user.userRef,
});

export default connect(mapStateToProps, {
  ...locationActions,
  ...bookListActions,
})(withStyles(styles)(ListBook));
