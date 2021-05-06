import { call, put, takeLatest } from 'redux-saga/effects';

import { SignInInputDto } from '../src/auth/dto/sign-in-input.dto';
import { SignUpInputDto } from '../src/auth/dto/sign-up-input.dto';
import * as userApi from '../utils/userApi';

export interface UserState {
  loading: boolean;
  error: string | null;
  accessToken: string | null;
}

export enum UserActionType {
  RESET_USER = 'RESET_USER',
  SIGN_UP = 'SIGN_UP',
  SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS',
  SIGN_UP_ERROR = 'SIGN_UP_ERROR',
  SIGN_IN = 'SIGN_IN',
  SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS',
  SIGN_IN_ERROR = 'SIGN_IN_ERROR',
}

interface SignInResponse {
  accessToken: string;
}

interface SignInError {
  error: string;
}

type Payload = SignInResponse | SignUpInputDto | SignInInputDto | SignInError;

interface UserAction {
  type: UserActionType;
  payload?: Payload;
}

export const initialState: UserState = { loading: false, error: null, accessToken: null };

export const signUp = (signUpInput: SignUpInputDto): UserAction => ({
  type: UserActionType.SIGN_UP,
  payload: signUpInput,
});

export const signIn = (signInInput: SignInInputDto): UserAction => ({
  type: UserActionType.SIGN_IN,
  payload: signInInput,
});

function* signUpSaga(action: UserAction) {
  try {
    const signUpInput = action.payload as SignUpInputDto;
    const res = yield call(userApi.signUp, signUpInput);
    if (res?.status === 201) {
      yield put({
        type: UserActionType.SIGN_UP_SUCCESS,
        payload: { accessToken: res.data.accessToken },
      });
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: UserActionType.SIGN_UP_ERROR,
      payload: { error: error.message },
    });
  }
}

function* signInSaga(action: UserAction) {
  try {
    const signInInput = action.payload as SignInInputDto;
    const res = yield call(userApi.signIn, signInInput);
    if (res?.status === 201) {
      yield put({
        type: UserActionType.SIGN_IN_SUCCESS,
        payload: { accessToken: res.data.accessToken },
      });
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: UserActionType.SIGN_IN_ERROR,
      payload: { error: error.message },
    });
  }
}

const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case UserActionType.SIGN_UP:
    case UserActionType.SIGN_IN:
      return {
        loading: true,
        error: null,
        accessToken: null,
      };
    case UserActionType.SIGN_UP_SUCCESS:
    case UserActionType.SIGN_IN_SUCCESS:
      const { accessToken } = action.payload as SignInResponse;
      return {
        loading: false,
        error: null,
        accessToken,
      };
    case UserActionType.SIGN_UP_ERROR:
    case UserActionType.SIGN_IN_ERROR:
      const { error } = action.payload as SignInError;
      return {
        loading: false,
        error,
        accessToken: null,
      };
    case UserActionType.RESET_USER:
    default:
      return initialState;
  }
};

export function* userSaga() {
  yield takeLatest(UserActionType.SIGN_UP, signUpSaga);
  yield takeLatest(UserActionType.SIGN_IN, signInSaga);
}

export default userReducer;
