import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { User } from 'lists-core/domain/User';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { UserActions, userActions, UserRefType } from '~/adapters';
import { GlobalState } from '~/frameworks';
import BaseRouter from './BaseRouter';
import Header from './Header';
import Loader from './Loader';
import Notification from './Notification';

const styles = (theme: Theme) => createStyles({
  root: {
    paddingBottom: theme.spacing(3),
  },
});

type MapStateToProps = {
  userRef: UserRefType;
};

type Props = WithStyles<typeof styles> & UserActions & MapStateToProps;

class AppWrapper extends PureComponent<Props> {
  componentDidMount() {
    const user = new User();
    user.email = 'e19a@yandex.ru';
    user.password = '123456';
    this.props.signIn(user);
  }

  render() {
    const { classes, userRef } = this.props;
    return (
      <Fragment>
        <CssBaseline />
        <Container maxWidth="md" classes={{ root: classes.root }}>
          <Header />
          <Loader />
          <Notification />
          {userRef !== null ? <BaseRouter /> : (
            <Box textAlign="center" m={2}>
              <Typography>Инициализация...</Typography>
            </Box>
          )}
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: GlobalState): MapStateToProps => ({
  userRef: state.user.userRef,
});

export default connect(mapStateToProps, {
  ...userActions,
})(withStyles(styles)(AppWrapper));
