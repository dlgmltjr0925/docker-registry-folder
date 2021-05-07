import { AxiosResponse } from 'axios';
import { call, CallEffect, put, takeEvery } from 'redux-saga/effects';

import { SignInInputDto } from '../src/auth/dto/sign-in-input.dto';
import { SignUpInputDto } from '../src/auth/dto/sign-up-input.dto';
import * as userApi from '../utils/userApi';

export interface AuthState {
  loading: boolean;
  error: string | null;
  accessToken: string | null;
}

export enum AuthActionType {
  RESET = 'RESET',
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

interface AuthAction {
  type: AuthActionType;
  payload?: Payload;
}

export const initialState: AuthState = { loading: false, error: null, accessToken: null };

export const signOut = () => ({
  type: AuthActionType.RESET,
});

export const signUp = (signUpInput: SignUpInputDto): AuthAction => ({
  type: AuthActionType.SIGN_UP,
  payload: signUpInput,
});

export const signIn = (signInInput: SignInInputDto): AuthAction => ({
  type: AuthActionType.SIGN_IN,
  payload: signInInput,
});

function* signUpSaga(action: AuthAction) {
  try {
    const signUpInput = action.payload as SignUpInputDto;
    const res: AxiosResponse<userApi.SignResponseData> = yield call(userApi.signUp, signUpInput);
    if (res?.status === 201) {
      yield put({
        type: AuthActionType.SIGN_UP_SUCCESS,
        payload: { accessToken: res.data.accessToken },
      });
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: AuthActionType.SIGN_UP_ERROR,
      payload: { error: error.message },
    });
  }
}

function* signInSaga(action: AuthAction) {
  try {
    const signInInput = action.payload as SignInInputDto;
    const res: AxiosResponse<userApi.SignResponseData> = yield call(userApi.signIn, signInInput);
    if (res?.status === 201) {
      yield put({
        type: AuthActionType.SIGN_IN_SUCCESS,
        payload: { accessToken: res.data.accessToken },
      });
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: AuthActionType.SIGN_IN_ERROR,
      payload: { error: error.message },
    });
  }
}

const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionType.SIGN_UP:
    case AuthActionType.SIGN_IN:
      return {
        loading: true,
        error: null,
        accessToken: null,
      };
    case AuthActionType.SIGN_UP_SUCCESS:
    case AuthActionType.SIGN_IN_SUCCESS:
      const { accessToken } = action.payload as SignInResponse;
      return {
        loading: false,
        error: null,
        accessToken,
      };
    case AuthActionType.SIGN_UP_ERROR:
    case AuthActionType.SIGN_IN_ERROR:
      const { error } = action.payload as SignInError;
      return {
        loading: false,
        error,
        accessToken: null,
      };
    case AuthActionType.RESET:
      return initialState;
    default:
      return state;
  }
};

export function* authSaga() {
  yield takeEvery(AuthActionType.SIGN_UP, signUpSaga);
  yield takeEvery(AuthActionType.SIGN_IN, signInSaga);
}

export default authReducer;
