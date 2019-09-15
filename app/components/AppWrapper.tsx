import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { User } from 'lists-core/domain/User';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { IUserActions, userActions } from '~/adapters';
import { IStateType } from '~/frameworks';
import BaseRouter from './BaseRouter';
import Header from './Header';
import Loader from './Loader';
import Notification from './Notification';

const styles = (theme: Theme) => createStyles({
  root: {
    paddingBottom: theme.spacing(3),
  },
});

interface IMapStateToProps {
  userId?: string;
}

interface IProps extends WithStyles<typeof styles>, IUserActions, IMapStateToProps {}

class AppWrapper extends PureComponent<IProps> {
  public componentDidMount() {
    const user = new User();
    user.email = 'e19a@yandex.ru';
    user.password = '123456';
    this.props.signIn(user);
  }

  public render() {
    const { classes, userId } = this.props;
    return (
      <Fragment>
        <CssBaseline />
        <Container maxWidth="md" classes={{ root: classes.root }}>
          <Header />
          <Loader />
          <Notification />
          {userId ? <BaseRouter /> : (
            <Box textAlign="center" m={2}>
              <Typography>Инициализация...</Typography>
            </Box>
          )}
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: IStateType): IMapStateToProps => ({
  userId: state.user.user.id,
});

export default connect(mapStateToProps, {
  ...userActions,
})(withStyles(styles)(AppWrapper));
