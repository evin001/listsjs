import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { OrderedMap } from 'immutable';
import { IBook } from 'lists-core/domain/Book';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { booksSelector, listBookAction } from '~/adapters';
import { IStateType } from '~/frameworks';

interface IProps {
  books: OrderedMap<string, IBook> | null;
  dispatchListBook: () => void;
}

class ListBook extends PureComponent<IProps> {
  public componentDidMount() {
    this.props.dispatchListBook();
  }

  public render() {
    const { books } = this.props;
    return (
      <Box my={1}>
        <Grid container spacing={2}>
          {
            books && books.map(((value, key) => (
              <Grid item xs={4} key={key}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="h2">{value.name}</Typography>
                    <Typography color="textSecondary">{value.author}</Typography>
                    <Typography variant="body2" component="p">{value.description}</Typography>
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
}

const mapStateToProps = (state: IStateType) => ({
  books: booksSelector(state.book),
});

const mapDispatchToProps = {
  dispatchListBook: listBookAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListBook);
