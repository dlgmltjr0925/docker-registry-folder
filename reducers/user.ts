import axios, { AxiosResponse } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

import { SignUpInputDto } from '../src/auth/dto/sign-up-input.dto';
import * as api from '../utils/api';

export interface UserState {
  loading: boolean;
  error: string | null;
  accessToken: string | null;
}

export const RESET_USER = 'RESET_USER';
export const SIGN_UP = 'SIGN_UP';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_ERROR = 'SIGN_UP_ERROR';

export enum UserActionType {
  RESET_USER,
  SIGN_UP,
  SIGN_UP_SUCCESS,
  SIGN_UP_ERROR,
}

interface SignInResponse {
  accessToken: string;
}

interface SignInError {
  error: string;
}

type Payload = SignInResponse | SignUpInputDto | SignInError;

interface UserAction {
  type: UserActionType;
  payload?: Payload;
}

interface SignInInput {
  username: string;
  password: string;
}

export const initialState: UserState = { loading: false, error: null, accessToken: null };

export const signUp = (signUpInput: SignUpInputDto): UserAction => ({
  type: UserActionType.SIGN_UP,
  payload: signUpInput,
});

function* signUpSaga(action: UserAction) {
  try {
    // const res = yield call(api.signUp, action.payload as SignUpInputDto);
    if (res?.status === 201) {
      yield put({
        type: UserActionType.SIGN_UP_SUCCESS,
        payload: { accessToken: res.data.accessToken },
      });
    }
  } catch (error) {
    yield put({
      type: UserActionType.SIGN_UP_ERROR,
      payload: { message: error.message },
    });
  }
}

const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case UserActionType.SIGN_UP:
      return {
        loading: true,
        error: null,
        accessToken: null,
      };
    case UserActionType.SIGN_UP_SUCCESS:
      const { accessToken } = action.payload as SignInResponse;
      return {
        loading: false,
        error: null,
        accessToken,
      };
    case UserActionType.SIGN_UP_ERROR:
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
  yield takeEvery(UserActionType.SIGN_UP, signUpSaga);
}

export default userReducer;
