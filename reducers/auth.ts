import * as userApi from '../lib/authApi';

import axios, { AxiosResponse } from 'axios';
import { call, delay, put, takeEvery } from 'redux-saga/effects';

import { SignInInputDto } from '../src/auth/dto/sign-in-input.dto';
import { SignUpInputDto } from '../src/auth/dto/sign-up-input.dto';
import { UserDto } from '../src/auth/dto/user.dto';
import { openSnackBar } from './snack-bars';

export interface AuthState {
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  user: UserDto | null;
}

export enum AuthActionType {
  RESET = 'RESET',
  SIGN_UP = 'SIGN_UP',
  SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS',
  SIGN_UP_ERROR = 'SIGN_UP_ERROR',
  SIGN_IN = 'SIGN_IN',
  SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS',
  SIGN_IN_ERROR = 'SIGN_IN_ERROR',
  SIGN_OUT = 'SIGN_OUT',
  SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS',
  SIGN_OUT_ERROR = 'SIGN_OUT_ERROR',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS',
  UPDATE_PROFILE_ERROR = 'UPDATE_PROFILE_ERROR',
}

interface SignInResponse {
  accessToken: string;
  user: UserDto;
}

interface SignInError {
  error: string;
}

type Payload = SignInResponse | SignUpInputDto | SignInInputDto | SignInError;

interface AuthAction {
  type: AuthActionType;
  payload?: Payload;
}

const initialState: AuthState = { loading: false, error: null, accessToken: null, user: null };

export const signOut = () => ({
  type: AuthActionType.SIGN_OUT,
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
        payload: res.data,
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
        payload: res.data,
      });
      yield put(openSnackBar({ severity: 'success', message: 'Login success!' }));
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: AuthActionType.SIGN_IN_ERROR,
      payload: { error: error.message },
    });
  }
}

function* signOutSaga() {
  try {
    const res: AxiosResponse<{}> = yield call(userApi.signOut);
    if (res?.status === 201) {
      yield put({
        type: AuthActionType.SIGN_OUT_SUCCESS,
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
  if (state.accessToken && axios.defaults.headers['Authorization'] !== `bearer ${state.accessToken}`) {
    axios.defaults.headers['Authorization'] = `bearer ${state.accessToken}`;
  }
  switch (action.type) {
    case AuthActionType.SIGN_UP:
    case AuthActionType.SIGN_IN:
      return {
        loading: true,
        error: null,
        accessToken: null,
        user: null,
      };
    case AuthActionType.SIGN_OUT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AuthActionType.SIGN_UP_SUCCESS:
    case AuthActionType.SIGN_IN_SUCCESS:
      const { accessToken, user } = action.payload as SignInResponse;
      axios.defaults.headers['Authorization'] = `bearer ${accessToken}`;
      return {
        loading: false,
        error: null,
        accessToken,
        user,
      };
    case AuthActionType.SIGN_UP_ERROR:
    case AuthActionType.SIGN_IN_ERROR:
      const { error } = action.payload as SignInError;
      return {
        loading: false,
        error,
        accessToken: null,
        user: null,
      };
    case AuthActionType.SIGN_OUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export function* authSaga() {
  yield takeEvery(AuthActionType.SIGN_UP, signUpSaga);
  yield takeEvery(AuthActionType.SIGN_IN, signInSaga);
  yield takeEvery(AuthActionType.SIGN_OUT, signOutSaga);
}

export default authReducer;
