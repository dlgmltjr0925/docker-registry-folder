import { FC, forwardRef, Ref } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions/transition';

import { RootState } from '../reducers';
import { closeAlertDialog } from '../reducers/alert-dialog';

interface AlertDialogProps {}

const Transition = forwardRef((props: TransitionProps, ref: Ref<unknown>) => {
  return <Slide direction="down" ref={ref} {...props} />;
});

const AlertDialog: FC<AlertDialogProps> = () => {
  const { open, title, content, options } = useSelector(
    ({ alertDialog }: RootState) => alertDialog,
    (left, right) => left.open === right.open
  );
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeAlertDialog());
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      {title !== '' && <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>}
      {content !== '' && (
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{content}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        {options && options.buttons.length > 0 ? (
          <>
            {options.buttons.map(({ label, color = 'primary', onClick }) => (
              <Button key={label} onClick={onClick} color={color}>
                {label}
              </Button>
            ))}
          </>
        ) : (
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        )}
        {options?.cancelable && (
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
