import { AxiosResponse } from 'axios';

import { call, put, takeLatest } from '@redux-saga/core/effects';

import * as registryApi from '../lib/registryApi';
import { RegistryDto } from '../src/registry/dto/registry.dto';
import { RegistryListResponse } from '../src/registry/registry.controller';
import { closeAlertDialog } from './alert-dialog';

interface SearchedRegistry extends RegistryDto {
  loading: boolean;
}

export interface RegistryState {
  loading: boolean;
  error: string | null;
  keyword: string;
  searchedRegistries: SearchedRegistry[];
  selectedRegistry: RegistryDto | null;
}

export enum RegistryActionType {
  SEARCH = 'SEARCH',
  SEARCH_SUCCESS = 'SEARCH_SUCCESS',
  SEARCH_ERROR = 'SEARCH_ERROR',
  REMOVE = 'REMOVE',
  REMOVE_SUCCESS = 'REMOVE_SUCCESS',
  REMOVE_ERROR = 'REMOVE_ERROR',
  SIGN_OUT = 'SIGN_OUT',
}

interface Keyword {
  keyword: string;
}

interface Remove {
  willBeRemovedRegistryIds: number[];
}

interface RemoveError extends Remove {
  error: string;
}

interface RegistryError {
  error: string;
}

type Payload = Keyword | RegistryListResponse | RegistryError | Remove | RemoveError;

interface RegistryAction<T = Payload> {
  type: RegistryActionType;
  payload: T;
}

export const initialState: RegistryState = {
  loading: false,
  error: null,
  keyword: '',
  searchedRegistries: [],
  selectedRegistry: null,
};

export const search = (keyword: string): RegistryAction<Keyword> => ({
  type: RegistryActionType.SEARCH,
  payload: { keyword },
});

export const removeRegistry = (id: number): RegistryAction<Remove> => ({
  type: RegistryActionType.REMOVE,
  payload: { willBeRemovedRegistryIds: [id] },
});

export const removeRegistries = (ids: number[]): RegistryAction<Remove> => ({
  type: RegistryActionType.REMOVE,
  payload: { willBeRemovedRegistryIds: ids },
});

function* searchSaga(action: RegistryAction) {
  try {
    const { keyword } = action.payload as Keyword;
    const res: AxiosResponse<RegistryListResponse> = yield call(registryApi.search, keyword);
    if (res?.status === 200) {
      yield put({
        type: RegistryActionType.SEARCH_SUCCESS,
        payload: res.data,
      });
    }
  } catch (error) {
    console.error(error);
    yield put({
      type: RegistryActionType.SEARCH_ERROR,
      payload: { error: error.message },
    });
  }
}

function* removeRegistrySaga(action: RegistryAction) {
  const { willBeRemovedRegistryIds } = action.payload as Remove;
  try {
    const res: AxiosResponse = yield call(registryApi.removeRegistries, willBeRemovedRegistryIds);
    if (res?.status === 200) {
      yield put({
        type: RegistryActionType.REMOVE_SUCCESS,
        payload: { willBeRemovedRegistryIds },
      });
    }
  } catch (error) {
    console.error(error);
    yield put({
      type: RegistryActionType.REMOVE_ERROR,
      payload: { willBeRemovedRegistryIds, error: error.message },
    });
  } finally {
    yield put(closeAlertDialog());
  }
}

const registryReducer = (state = initialState, action: RegistryAction): RegistryState => {
  switch (action.type) {
    case RegistryActionType.SEARCH:
      const { keyword } = action.payload as Keyword;
      return {
        ...state,
        loading: true,
        error: null,
        keyword,
      };
    case RegistryActionType.SEARCH_SUCCESS:
      const { registries } = action.payload as RegistryListResponse;
      return {
        ...state,
        loading: false,
        error: null,
        searchedRegistries: registries.map((registry) => ({ ...registry, loading: false, error: null })),
      };
    case RegistryActionType.SEARCH_ERROR: {
      const { error } = action.payload as RegistryError;
      return {
        ...state,
        loading: false,
        error,
      };
    }
    case RegistryActionType.REMOVE: {
      const { willBeRemovedRegistryIds } = action.payload as Remove;
      return {
        ...state,
        searchedRegistries: state.searchedRegistries.map((registry) => ({
          ...registry,
          loading: willBeRemovedRegistryIds.includes(registry.id),
        })),
      };
    }
    case RegistryActionType.REMOVE_SUCCESS: {
      const { willBeRemovedRegistryIds } = action.payload as Remove;
      return {
        ...state,
        searchedRegistries: state.searchedRegistries.filter(({ id }) => !willBeRemovedRegistryIds.includes(id)),
      };
    }
    case RegistryActionType.REMOVE_ERROR: {
      const { error } = action.payload as RemoveError;
      return {
        ...state,
        error,
        searchedRegistries: state.searchedRegistries.map((registry) => ({
          ...registry,
          loading: false,
        })),
      };
    }
    case RegistryActionType.SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export function* registrySaga() {
  yield takeLatest(RegistryActionType.SEARCH, searchSaga);
  yield takeLatest(RegistryActionType.REMOVE, removeRegistrySaga);
}

export default registryReducer;
