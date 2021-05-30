import { AxiosResponse } from 'axios';

import { call, put, takeLatest } from '@redux-saga/core/effects';

import * as registryApi from '../lib/registryApi';
import { CreateRegistryDto } from '../src/registry/dto/create-registry.dto';
import { RegistryDto } from '../src/registry/dto/registry.dto';
import { UpdateRegistryDto } from '../src/registry/dto/update-registry.dto';
import { CreateRegistryResponse, RegistryListResponse } from '../src/registry/registry.controller';
import { closeAlertDialog } from './alert-dialog';
import { openSnackBar } from './snack-bars';

interface SearchedRegistry extends RegistryDto {
  loading: boolean;
}

interface SearchState {
  loading: boolean;
  keyword: string;
  searchedRegistries: SearchedRegistry[];
}

interface AddRegistryState {
  loading: boolean;
  done: boolean;
}

type UpdateRegistryState = AddRegistryState;

export interface RegistryState {
  search: SearchState;
  addRegistry: AddRegistryState;
  updateRegistry: UpdateRegistryState;
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
  search: {
    loading: false,
    keyword: '',
    searchedRegistries: [],
  },
  addRegistry: {
    loading: false,
    done: false,
  },
  updateRegistry: {
    loading: false,
    done: false,
  },
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
      yield put(
        openSnackBar({
          message: `Removed ${willBeRemovedRegistryIds.length > 1 ? 'registries' : 'registry'}`,
          severity: 'success',
        })
      );
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
      yield put(
        openSnackBar({
          message: `Added registry`,
          severity: 'success',
        })
      );
    }
  } catch (error) {
    if (error.response) {
      const { message } = error.response.data;
      yield put({
        type: RegistryActionType.ADD_REGISTRY_ERROR,
        payload: { error: message },
      });
    }
  }
}

function* updateRegistrySaga(action: RegistryAction<UpdateRegistry>) {
  const { registry } = action.payload;
  try {
    const res: AxiosResponse = yield call(registryApi.updateRegistry, registry);
    if (res?.status === 200) {
      yield put({
        type: RegistryActionType.UPDATE_REGISTRY_SUCCESS,
        payload: { registry },
      });
      yield put(
        openSnackBar({
          message: `Updated registry`,
          severity: 'success',
        })
      );
    }
  } catch (error) {
    if (error.response) {
      const { message } = error.response.data;
      yield put({
        type: RegistryActionType.UPDATE_REGISTRY_ERROR,
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
        search: {
          ...state.search,
          keyword,
          loading: true,
        },
      };
    case RegistryActionType.SEARCH_SUCCESS:
      const { registries } = action.payload as RegistryListResponse;
      return {
        ...state,
        search: {
          ...state.search,
          loading: false,
          searchedRegistries: registries.map((registry) => ({ ...registry, loading: false })),
        },
      };
    case RegistryActionType.ADD_REGISTRY_ERROR:
    case RegistryActionType.UPDATE_REGISTRY_ERROR:
    case RegistryActionType.SEARCH_ERROR: {
      const { error } = action.payload as RegistryError;
      return initialState;
    }
    case RegistryActionType.REMOVE: {
      const { willBeRemovedRegistryIds } = action.payload as Remove;
      return {
        ...state,
        search: {
          ...state.search,
          searchedRegistries: state.search.searchedRegistries.map((registry) => ({
            ...registry,
            loading: willBeRemovedRegistryIds.includes(registry.id),
          })),
        },
      };
    }
    case RegistryActionType.REMOVE_SUCCESS: {
      const { willBeRemovedRegistryIds } = action.payload as Remove;
      return {
        ...state,
        search: {
          ...state.search,
          searchedRegistries: state.search.searchedRegistries.filter(
            ({ id }) => !willBeRemovedRegistryIds.includes(id)
          ),
        },
      };
    }
    case RegistryActionType.REMOVE_ERROR: {
      const { error } = action.payload as RemoveError;
      return {
        ...state,
        search: {
          ...state.search,
          searchedRegistries: state.search.searchedRegistries.map((registry) => ({
            ...registry,
            loading: false,
          })),
        },
      };
    }
    case RegistryActionType.ADD_REGISTRY: {
      return {
        ...state,
        addRegistry: {
          ...state.addRegistry,
          loading: true,
        },
      };
    }
    case RegistryActionType.ADD_REGISTRY_SUCCESS: {
      return {
        ...state,
        addRegistry: {
          ...state.addRegistry,
          done: true,
        },
      };
    }
    case RegistryActionType.UPDATE_REGISTRY: {
      return {
        ...state,
        updateRegistry: {
          ...state.updateRegistry,
          loading: true,
        },
      };
    }
    case RegistryActionType.UPDATE_REGISTRY_SUCCESS: {
      return {
        ...state,
        updateRegistry: {
          ...state.updateRegistry,
          done: true,
        },
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
  yield takeLatest(RegistryActionType.UPDATE_REGISTRY, updateRegistrySaga);
}

export default registryReducer;
