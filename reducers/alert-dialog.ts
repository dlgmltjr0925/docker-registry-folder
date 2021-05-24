import { MouseEventHandler } from 'react';

interface AlertDialogButton {
  label: string;
  color?: 'primary' | 'inherit' | 'secondary' | 'default';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface AlertDialogOption {
  buttons: AlertDialogButton[];
  cancelable?: boolean;
}

interface AlertDialogInfo {
  title: string;
  content: string;
  options?: AlertDialogOption;
}

export interface AlertDialogState extends AlertDialogInfo {
  open: boolean;
}

enum AlertDialogActionType {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

interface AlertDialogAction {
  type: AlertDialogActionType;
  payload?: AlertDialogInfo;
}

export const openAlertDialog = ({ title = '', content = '', options }: Partial<AlertDialogInfo>) => ({
  type: AlertDialogActionType.OPEN,
  payload: {
    title,
    content,
    options,
  },
});

export const closeAlertDialog = () => ({
  type: AlertDialogActionType.CLOSE,
});

const initialState: AlertDialogState = {
  open: false,
  title: '',
  content: '',
};

const alertDialogReducer = (state = initialState, action: AlertDialogAction) => {
  switch (action.type) {
    case AlertDialogActionType.OPEN:
      return {
        open: true,
        ...(action.payload as AlertDialogInfo),
      };
    case AlertDialogActionType.CLOSE:
      return { ...state, open: false };
    default:
      return state;
  }
};

export default alertDialogReducer;
