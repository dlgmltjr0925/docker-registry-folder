import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { closeSnackBar } from 'reducers/snack-bars';

import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const Alert: FC<AlertProps> = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const SnackBars = () => {
  const { open, messages } = useSelector(({ snackBars }: RootState) => snackBars);
  const dispatch = useDispatch();

  const handleClose = (id?: number) => {
    return () => {
      dispatch(closeSnackBar(id));
    };
  };

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose()}>
      <div>
        {messages.map(({ id, severity, message }) => (
          <Alert key={id} onClose={handleClose(id)} severity={severity}>
            {message}
          </Alert>
        ))}
      </div>
    </Snackbar>
  );
};

export default SnackBars;
