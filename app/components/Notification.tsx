import { makeStyles, Theme } from '@material-ui/core';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import { NotificationActions, notificationActions, NotificationType } from '~/adapters';
import { GlobalState } from '~/frameworks';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

type Props = {
  message?: string;
  type?: NotificationType;
} & NotificationActions;

const Notification = ({ message, type, resetMessage }: Props) => {
  const classes = useStyles();
  const Icon = type && variantIcon[type];

  function handleClose(event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    resetMessage();
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(message)}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <SnackbarContent
        className={clsx(type && classes[type])}
        aria-describedby="client-snackbar"
        message={
          <span className={classes.message}>
            {Icon && <Icon className={clsx(classes.icon, classes.iconVariant)} />}
              {message}
          </span>
        }
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

const mapStateToProps = (state: GlobalState) => ({
  message: state.notification.message,
  type: state.notification.type,
});

export default connect(mapStateToProps, notificationActions)(Notification);
