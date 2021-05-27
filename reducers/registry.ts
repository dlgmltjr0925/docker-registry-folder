import { AxiosResponse } from 'axios';

import { call, put, takeLatest } from '@redux-saga/core/effects';

import * as registryApi from '../lib/registryApi';
import { CreateRegistryDto } from '../src/registry/dto/create-registry.dto';
import { RegistryDto } from '../src/registry/dto/registry.dto';
import { UpdateRegistryDto } from '../src/registry/dto/update-registry.dto';
import { CreateRegistryResponse, RegistryListResponse } from '../src/registry/registry.controller';
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
  ADD_REGISTRY = 'ADD_REGISTRY',
  ADD_REGISTRY_SUCCESS = 'ADD_REGISTRY_SUCCESS',
  ADD_REGISTRY_ERROR = 'ADD_REGISTRY_ERROR',
  UPDATE_REGISTRY = 'UPDATE_REGISTRY',
  UPDATE_REGISTRY_SUCCESS = 'UPDATE_REGISTRY_SUCCESS',
  UPDATE_REGISTRY_ERROR = 'UPDATE_REGISTRY_ERROR',
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

interface AddRegistry {
  registry: CreateRegistryDto;
}

interface UpdateRegistry {
  registry: UpdateRegistryDto;
}

type Payload =
  | Keyword
  | RegistryListResponse
  | RegistryError
  | Remove
  | RemoveError
  | AddRegistry
  | CreateRegistryResponse;

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

export const addRegistry = (registry: CreateRegistryDto): RegistryAction<AddRegistry> => ({
  type: RegistryActionType.ADD_REGISTRY,
  payload: { registry },
});

export const updateRegistry = (registry: UpdateRegistryDto): RegistryAction<UpdateRegistry> => ({
  type: RegistryActionType.UPDATE_REGISTRY,
  payload: { registry },
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

function* removeRegistrySaga(action: RegistryAction<Remove>) {
  const { willBeRemovedRegistryIds } = action.payload;
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

function* addRegistrySaga(action: RegistryAction<AddRegistry>) {
  const { registry } = action.payload;
  try {
    const res: AxiosResponse = yield call(registryApi.addRegistry, registry);
    if (res?.status === 201) {
      yield put({
        type: RegistryActionType.ADD_REGISTRY_SUCCESS,
        payload: { registry: res.data.registry },
      });
    }
    console.log(res);
  } catch (error) {
    console.error('here', error.response);
    if (error.response) {
      const { message } = error.response.data;
      yield put({
        type: RegistryActionType.ADD_REGISTRY_ERROR,
        payload: { error: message },
      });
    }
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
    case RegistryActionType.ADD_REGISTRY_ERROR:
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
    case RegistryActionType.ADD_REGISTRY: {
      return {
        ...state,
        loading: true,
      };
    }
    case RegistryActionType.ADD_REGISTRY_SUCCESS: {
      const { registry } = action.payload as CreateRegistryResponse;
      return {
        ...state,
        loading: false,
        searchedRegistries: state.searchedRegistries.concat({
          ...registry,
          loading: false,
        }) as SearchedRegistry[],
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
  yield takeLatest(RegistryActionType.ADD_REGISTRY, addRegistrySaga);
}

export default registryReducer;
