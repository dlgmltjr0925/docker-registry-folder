import { takeEvery } from 'redux-saga/effects';

import { delay, put } from '@redux-saga/core/effects';

interface Message {
  id: number;
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export interface SnackBarsState {
  open: boolean;
  messages: Message[];
}

enum SnackBarsActionType {
  OPEN_SNACK_BAR = 'OPEN_SNACK_BAR',
  CLOSE_SNACK_BAR = 'CLOSE_SNACK_BAR',
  ADD_MESSAGE = 'ADD_MESSAGE',
}

interface OpenSnackBar {
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface CloseSnackBarArgs {
  id: number;
}

type SnackBarsPayload = OpenSnackBar | Message | CloseSnackBarArgs;

interface SnackBarsAction<T = SnackBarsPayload> {
  type: SnackBarsActionType;
  payload: T;
}

export const openSnackBar = (args: OpenSnackBar) => ({
  type: SnackBarsActionType.OPEN_SNACK_BAR,
  payload: args,
});

const addMessage = (message: Message) => ({
  type: SnackBarsActionType.ADD_MESSAGE,
  payload: message,
});

export const closeSnackBar = (id?: number) => ({
  type: SnackBarsActionType.CLOSE_SNACK_BAR,
  payload: { id },
});

let snackBarId = 0;
const getSnackBarId = () => {
  return ++snackBarId;
};

function* openSnackBarSaga(action: SnackBarsAction<OpenSnackBar>) {
  const id = getSnackBarId();
  yield put(addMessage({ id, ...action.payload }));
  yield delay(3000);
  yield put(closeSnackBar(id));
}

const initialState: SnackBarsState = {
  open: false,
  messages: [],
};

const snackBarsReducer = (state = initialState, action: SnackBarsAction) => {
  switch (action.type) {
    case SnackBarsActionType.ADD_MESSAGE: {
      const { id, severity, message } = action.payload as Message;
      return {
        open: true,
        messages: state.messages.concat({
          id,
          severity,
          message,
        }),
      };
    }
    case SnackBarsActionType.CLOSE_SNACK_BAR: {
      const { id } = action.payload as CloseSnackBarArgs;
      if (!id) return initialState;
      const messages = state.messages.filter((message) => message.id !== id);
      return {
        open: messages.length > 0,
        messages,
      };
    }
    default:
      return state;
  }
};

export function* snackBarsSaga() {
  yield takeEvery(SnackBarsActionType.OPEN_SNACK_BAR, openSnackBarSaga);
}

export default snackBarsReducer;
