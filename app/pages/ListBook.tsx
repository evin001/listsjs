import { IBook } from 'lists-core/domain/Book';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { booksSelector, listBookAction } from '~/adapters';
import { IStateType } from '~/frameworks';

interface IProps {
  books: Map<string, IBook> | null;
  dispatchListBook: () => void;
}

class ListBook extends PureComponent<IProps> {
  public componentDidMount() {
    this.props.dispatchListBook();
  }

  public render() {
    return (
      <div>
        hello
      </div>
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
