import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { assign, interpret, Machine, State } from 'xstate';
import { bookListSelector, BooksType, listBookAction } from '~/adapters';
import { IStateType } from '~/frameworks';

interface IMapStateToProps {
  done: boolean;
  isLoading: boolean;
  books: BooksType;
}

interface IMapDispatchToProps {
  dispatchListBook: () => void;
}

interface IProps extends WithStyles<typeof styles>, IMapStateToProps, IMapDispatchToProps {}

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
}

type PageEvent =
  | { type: 'INC' }
  | { type: 'DEC' }
  | { type: 'OFFSET' };

const increment = (context: IPageContext) => context.page + 1;
const decrement = (context: IPageContext) => context.page - 1;
const offsetPage = (context: IPageContext, event: any) => event.value - 1;
const isNotMin = (context: IPageContext) => context.page >= 0;

const pageMachine = Machine<IPageContext, IPageStateSchema, PageEvent>({
  initial: 'active',
  context: {
    page: 0,
  },
  states: {
    active: {
      on: {
        INC: {
          actions: assign({ page: increment }),
        },
        DEC: {
          actions: assign({ page: decrement }),
          cond: isNotMin,
        },
        OFFSET: {
          actions: assign({ page: offsetPage }),
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
    marginBottom: theme.spacing(1),
  },
  progress: {
    position: 'absolute',
    width: '100%',
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
    this.props.dispatchListBook();
  }

  public componentDidUpdate() {
    const { done, books } = this.props;
    const { current } = this.state;
    if (done && books.size === current.context.page) {
      this.service.send('OFFSET', { value: books.size });
    }
  }

  public componentWillUnmount() {
    this.service.stop();
  }

  public render() {
    const { books, done, isLoading, classes } = this.props;
    const { current } = this.state;
    const { page } = current.context;
    const listBooks = books.get(page);

    return (
      <Fragment>
        {(isLoading) && (
          <Box position="relative">
            <LinearProgress color="secondary" className={classes.progress} />
          </Box>
        )}
        <Box my={1}>
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
              disabled={done && page + 1 === books.size}
            >
              <NavigateNext />
            </IconButton>
          </Box>

          {!isLoading && (
            <Grid container spacing={2}>
              {listBooks && listBooks.map(((value, key) => (
                <Grid item xs={4} key={key}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="h2">{value.name}</Typography>
                      <Typography color="textSecondary">{value.author}</Typography>
                      <Typography variant="body2" component="p">{value.shortDescription}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Подробнее</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))).valueSeq().toArray()}
            </Grid>
          )}
        </Box>
      </Fragment>
    );
  }

  private handleClickBeforePage = () => {
    this.service.send('DEC');
  }

  private handleClickNextPage = () => {
    const { books, done } = this.props;
    const { current } = this.state;
    if (!(done || books.get(current.context.page + 1))) {
      this.props.dispatchListBook();
    }
    this.service.send('INC');
  }
}

const mapStateToProps = (state: IStateType): IMapStateToProps => ({
  books: bookListSelector(state.book),
  done: state.book.done,
  isLoading: state.book.isLoading,
});

const mapDispatchToProps: IMapDispatchToProps = {
  dispatchListBook: listBookAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ListBook));
