import { AxiosResponse } from 'axios';

import { call, put, takeLatest } from '@redux-saga/core/effects';

import * as usersApi from '../lib/usersApi';
import { UserDto } from '../src/auth/dto/user.dto';
import { UserListResponse } from '../src/user/user.controller';
import { openSnackBar, openSnackBarByError } from './snack-bars';

interface SearchedUser extends UserDto {
  loading: boolean;
}

interface SearchState {
  loading: boolean;
  keyword: string;
  searchedUsers: SearchedUser[];
}

export interface UsersState {
  search: SearchState;
}

enum UsersActionType {
  SEARCH_USER = 'SEARCH_USER',
  SEARCH_USER_SUCCESS = 'SEARCH_USER_SUCCESS',
  SEARCH_USER_ERROR = 'SEARCH_USER_ERROR',
  REMOVE_USERS = 'REMOVE_USERS',
  REMOVE_USERS_SUCCESS = 'REMOVE_USERS_SUCCESS',
  REMOVE_USERS_ERROR = 'REMOVE_USERS_ERROR',
}

interface Keyword {
  keyword: string;
}

interface Remove {
  willBeRemovedUserIds: number[];
}

type Payload = Keyword | UserListResponse | Remove;

interface UsersAction<T = Payload> {
  type: UsersActionType;
  payload: T;
}

const initialState: UsersState = {
  search: {
    loading: false,
    keyword: '',
    searchedUsers: [],
  },
};

export const search = (keyword: string): UsersAction<Keyword> => ({
  type: UsersActionType.SEARCH_USER,
  payload: { keyword },
});

export const removeUsers = (ids: number[]): UsersAction<Remove> => ({
  type: UsersActionType.REMOVE_USERS,
  payload: { willBeRemovedUserIds: ids },
});

function* searchSaga(action: UsersAction) {
  try {
    const { keyword } = action.payload as Keyword;
    const res: AxiosResponse<UserListResponse> = yield call(usersApi.search, keyword);
    if (res?.status === 200) {
      yield put({
        type: UsersActionType.SEARCH_USER_SUCCESS,
        payload: res.data,
      });
    }
  } catch (error) {
    yield put({
      type: UsersActionType.SEARCH_USER_ERROR,
      payload: { error: error.message },
    });
    yield openSnackBarByError(error);
  }
}

function* removeUsersSaga(action: UsersAction<Remove>) {
  const { willBeRemovedUserIds } = action.payload;
  try {
    const res: AxiosResponse = yield call(usersApi.removeUsers, willBeRemovedUserIds);
    if (res?.status === 200) {
      yield put({
        type: UsersActionType.REMOVE_USERS_SUCCESS,
        payload: { willBeRemovedUserIds },
      });
      yield put(
        openSnackBar({
          message: `Removed ${willBeRemovedUserIds.length > 1 ? 'users' : 'user'}`,
          severity: 'success',
        })
      );
    }
  } catch (error) {
    yield put({
      type: UsersActionType.REMOVE_USERS_ERROR,
      payload: { willBeRemovedUserIds, error: error.message },
    });
    yield openSnackBarByError(error);
  }
}

const usersReducer = (state = initialState, action: UsersAction): UsersState => {
  switch (action.type) {
    case UsersActionType.SEARCH_USER:
      const { keyword } = action.payload as Keyword;
      return {
        ...state,
        search: {
          ...state.search,
          keyword,
          loading: true,
        },
      };
    case UsersActionType.SEARCH_USER_SUCCESS:
      const { users } = action.payload as UserListResponse;
      return {
        ...state,
        search: {
          ...state.search,
          loading: false,
          searchedUsers: users.map((user) => ({ ...user, loading: false })),
        },
      };
    case UsersActionType.SEARCH_USER_ERROR:
      return {
        ...state,
        search: {
          ...state.search,
          loading: false,
          searchedUsers: [],
        },
      };
    case UsersActionType.REMOVE_USERS:
      const { willBeRemovedUserIds } = action.payload as Remove;
      return {
        ...state,
        search: {
          ...state.search,
          searchedUsers: state.search.searchedUsers.map((user) => ({
            ...user,
            loading: willBeRemovedUserIds.includes(user.id),
          })),
        },
      };
    case UsersActionType.REMOVE_USERS_SUCCESS: {
      const { willBeRemovedUserIds } = action.payload as Remove;
      return {
        ...state,
        search: {
          ...state.search,
          searchedUsers: state.search.searchedUsers.filter(({ id }) => !willBeRemovedUserIds.includes(id)),
        },
      };
    }
    case UsersActionType.REMOVE_USERS_ERROR: {
      return {
        ...state,
        search: {
          ...state.search,
          searchedUsers: state.search.searchedUsers.map((user) => ({
            ...user,
            loading: false,
          })),
        },
      };
    }
    default:
      return state;
  }
};

export function* usersSaga() {
  yield takeLatest(UsersActionType.SEARCH_USER, searchSaga);
  yield takeLatest(UsersActionType.REMOVE_USERS, removeUsersSaga);
}

export default usersReducer;
