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
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bookListSelector, BooksType, listBookAction } from '~/adapters';
import { IStateType } from '~/frameworks';

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
    margin: theme.spacing(2),
  },
});

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
  page: number;
}

class ListBook extends PureComponent<IProps, IState> {

  public static getDerivedStateFromProps(props: IProps, state: IState) {
    if (props.done && state.page === props.books.size) {
      return {
        page: props.books.size - 1,
      };
    }
    return null;
  }

  public state = {
    page: 0,
  };

  public componentDidMount() {
    this.props.dispatchListBook();
  }

  public render() {
    const { books, done, isLoading, classes } = this.props;
    const { page } = this.state;
    const listBooks = books.get(page);

    return (
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

        {!isLoading ? (
          <Grid container spacing={2}>
            {
              listBooks && listBooks.map(((value, key) => (
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
              ))).valueSeq().toArray()
            }
          </Grid>
        ) : (
          <LinearProgress color="secondary" />
        )}
      </Box>
    );
  }

  private handleClickBeforePage = () => {
    const { page } = this.state;
    if (page > 0) {
      this.setState({ page: page - 1 });
    }
  }

  private handleClickNextPage = () => {
    const { books, done } = this.props;
    const page = this.state.page + 1;
    if (!(done || books.get(page))) {
      this.props.dispatchListBook();
    }
    this.setState({ page });
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
