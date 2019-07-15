import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { listBookAction } from '~/adapters';

interface IProps {
  dispatchListBook: () => void;
}

class ListBook extends PureComponent<IProps> {
  public componentDidMount() {
    this.props.dispatchListBook();
  }

  public render() {
    return (
      <div>list book</div>
    );
  }
}

const mapDispatchToProps = {
  dispatchListBook: listBookAction,
};

export default connect(null, mapDispatchToProps)(ListBook);
