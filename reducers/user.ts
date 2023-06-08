import * as userApi from '../lib/userApi';

import { call, put, takeLatest } from '@redux-saga/core/effects';
import { openSnackBar, openSnackBarByError } from './snack-bars';

import { AxiosResponse } from 'axios';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserDto } from '../src/auth/dto/user.dto';
import { UserListResponse } from '../src/user/user.controller';

interface SearchedUser extends UserDto {
  loading: boolean;
}

interface SearchState {
  loading: boolean;
  keyword: string;
  searchedUsers: SearchedUser[];
}

interface AddUserState {
  loading: boolean;
  done: boolean;
}

type UpdateUserState = AddUserState;

export interface UserState {
  search: SearchState;
  addUser: AddUserState;
  updateUser: UpdateUserState;
}

enum UserActionType {
  SEARCH_USER = 'SEARCH_USER',
  SEARCH_USER_SUCCESS = 'SEARCH_USER_SUCCESS',
  SEARCH_USER_ERROR = 'SEARCH_USER_ERROR',
  REMOVE_USERS = 'REMOVE_USERS',
  REMOVE_USERS_SUCCESS = 'REMOVE_USERS_SUCCESS',
  REMOVE_USERS_ERROR = 'REMOVE_USERS_ERROR',
  ADD_USER = 'ADD_USER',
  ADD_USER_SUCCESS = 'ADD_USER_SUCCESS',
  ADD_USER_ERROR = 'ADD_USER_ERROR',
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS',
  UPDATE_USER_ERROR = 'UPDATE_USER_ERROR',
}

interface Keyword {
  keyword: string;
}

interface Remove {
  willBeRemovedUserIds: number[];
}

type Payload = Keyword | UserListResponse | Remove;

interface AddUser {
  user: CreateUserDto;
}

interface UpdateUser {
  user: UpdateUserDto;
}

interface UserAction<T = Payload> {
  type: UserActionType;
  payload: T;
}

const initialState: UserState = {
  search: {
    loading: false,
    keyword: '',
    searchedUsers: [],
  },
  addUser: {
    loading: false,
    done: false,
  },
  updateUser: {
    loading: false,
    done: false,
  },
};

export const search = (keyword: string): UserAction<Keyword> => ({
  type: UserActionType.SEARCH_USER,
  payload: { keyword },
});

export const removeUsers = (ids: number[]): UserAction<Remove> => ({
  type: UserActionType.REMOVE_USERS,
  payload: { willBeRemovedUserIds: ids },
});

export const addUser = (user: CreateUserDto): UserAction<AddUser> => ({
  type: UserActionType.ADD_USER,
  payload: { user },
});

export const updateUser = (user: UpdateUserDto): UserAction<UpdateUser> => ({
  type: UserActionType.UPDATE_USER,
  payload: { user },
});

function* searchSaga(action: UserAction) {
  try {
    const { keyword } = action.payload as Keyword;
    const res: AxiosResponse<UserListResponse> = yield call(userApi.search, keyword);
    if (res?.status === 200) {
      yield put({
        type: UserActionType.SEARCH_USER_SUCCESS,
        payload: res.data,
      });
    }
  } catch (error: any) {
    yield put({
      type: UserActionType.SEARCH_USER_ERROR,
      payload: { error: error.message },
    });
    yield openSnackBarByError(error);
  }
}

function* removeUsersSaga(action: UserAction<Remove>) {
  const { willBeRemovedUserIds } = action.payload;
  try {
    const res: AxiosResponse = yield call(userApi.removeUsers, willBeRemovedUserIds);
    if (res?.status === 200) {
      yield put({
        type: UserActionType.REMOVE_USERS_SUCCESS,
        payload: { willBeRemovedUserIds },
      });
      yield put(
        openSnackBar({
          message: `Removed ${willBeRemovedUserIds.length > 1 ? 'users' : 'user'}`,
          severity: 'success',
        })
      );
    }
  } catch (error: any) {
    yield put({
      type: UserActionType.REMOVE_USERS_ERROR,
      payload: { willBeRemovedUserIds, error: error.message },
    });
    yield openSnackBarByError(error);
  }
}

function* addUserSaga(action: UserAction<AddUser>) {
  const { user } = action.payload;
  try {
    const res: AxiosResponse = yield call(userApi.addUser, user);
    if (res?.status === 201) {
      yield put({
        type: UserActionType.ADD_USER_SUCCESS,
        payload: { user: res.data.user },
      });
      yield put(
        openSnackBar({
          message: 'Added user',
          severity: 'success',
        })
      );
    }
  } catch (error: any) {
    yield put({
      type: UserActionType.ADD_USER_ERROR,
      payload: { error: error.message },
    });
    yield openSnackBarByError(error);
  }
}

function* updateUserSaga(action: UserAction<UpdateUser>) {
  const { user } = action.payload;
  try {
    const res: AxiosResponse = yield call(userApi.updateUser, user);
    if (res?.status === 200) {
      yield put({
        type: UserActionType.UPDATE_USER_SUCCESS,
        payload: { user },
      });
      yield put(
        openSnackBar({
          message: 'Updated user',
          severity: 'success',
        })
      );
    }
  } catch (error: any) {
    console.log('here', error.message);
    yield put({
      type: UserActionType.UPDATE_USER_ERROR,
      payload: { error: error.message },
    });
    yield openSnackBarByError(error);
  }
}

const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case UserActionType.SEARCH_USER:
      const { keyword } = action.payload as Keyword;
      return {
        ...state,
        search: {
          ...state.search,
          keyword,
          loading: true,
        },
      };
    case UserActionType.SEARCH_USER_SUCCESS:
      const { users } = action.payload as UserListResponse;
      return {
        ...state,
        search: {
          ...state.search,
          loading: false,
          searchedUsers: users.map((user) => ({ ...user, loading: false })),
        },
      };
    case UserActionType.ADD_USER_ERROR:
    case UserActionType.UPDATE_USER_ERROR:
    case UserActionType.SEARCH_USER_ERROR:
      return initialState;
    case UserActionType.REMOVE_USERS:
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
    case UserActionType.REMOVE_USERS_SUCCESS: {
      const { willBeRemovedUserIds } = action.payload as Remove;
      return {
        ...state,
        search: {
          ...state.search,
          searchedUsers: state.search.searchedUsers.filter(({ id }) => !willBeRemovedUserIds.includes(id)),
        },
      };
    }
    case UserActionType.REMOVE_USERS_ERROR: {
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
    case UserActionType.ADD_USER: {
      return {
        ...state,
        addUser: {
          loading: true,
          done: false,
        },
      };
    }
    case UserActionType.ADD_USER_SUCCESS: {
      return {
        ...state,
        addUser: {
          loading: false,
          done: true,
        },
      };
    }
    case UserActionType.UPDATE_USER: {
      return {
        ...state,
        updateUser: {
          loading: true,
          done: false,
        },
      };
    }
    case UserActionType.UPDATE_USER_SUCCESS: {
      return {
        ...state,
        updateUser: {
          loading: false,
          done: true,
        },
      };
    }
    default:
      return state;
  }
};

export function* usersSaga() {
  yield takeLatest(UserActionType.SEARCH_USER, searchSaga);
  yield takeLatest(UserActionType.REMOVE_USERS, removeUsersSaga);
  yield takeLatest(UserActionType.ADD_USER, addUserSaga);
  yield takeLatest(UserActionType.UPDATE_USER, updateUserSaga);
}

export default userReducer;
