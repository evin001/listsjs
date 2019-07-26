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
});

interface IMapStateToProps {
  books: BooksType;
}

interface IMapDispatchToProps {
  dispatchListBook: (page: number) => void;
}

interface IProps extends WithStyles<typeof styles>, IMapStateToProps, IMapDispatchToProps {}

interface IState {
  page: number;
}

class ListBook extends PureComponent<IProps, IState> {
  public state = {
    page: 0,
  };

  public componentDidMount() {
    const { page } = this.state;
    this.props.dispatchListBook(page);
  }

  public render() {
    const { books, classes } = this.props;
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
          <IconButton onClick={this.handleClickNextPage}>
            <NavigateNext />
          </IconButton>
        </Box>
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
    const { dispatchListBook } = this.props;
    const { page } = this.state;

    dispatchListBook(page);

    this.setState({ page: page + 1 });
  }
}

const mapStateToProps = (state: IStateType): IMapStateToProps => ({
  books: bookListSelector(state.book),
});

const mapDispatchToProps: IMapDispatchToProps = {
  dispatchListBook: listBookAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ListBook));
