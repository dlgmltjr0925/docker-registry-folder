import { AxiosResponse } from 'axios';

import { call, put, takeLatest } from '@redux-saga/core/effects';

import * as registryApi from '../lib/registryApi';
import { RegistryDto } from '../src/registry/dto/registry.dto';
import { RegistryListResponse } from '../src/registry/registry.controller';

export interface RegistryState {
  loading: boolean;
  error: string | null;
  keyword: string;
  searchedRegistries: RegistryDto[];
  selectedRegistry: RegistryDto | null;
}

export enum RegistryActionType {
  SEARCH = 'SEARCH',
  SEARCH_SUCCESS = 'SEARCH_SUCCESS',
  SEARCH_ERROR = 'SEARCH_ERROR',
  SIGN_OUT = 'SIGN_OUT',
}

interface Keyword {
  keyword: string;
}

interface RegistryError {
  error: string;
}

type Payload = Keyword | RegistryListResponse | RegistryError;

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

function* searchSaga(action: RegistryAction) {
  try {
    const { keyword } = action.payload as Keyword;
    const res: AxiosResponse<RegistryListResponse> = yield call(registryApi.search, keyword);
    console.log(res.data);
    if (res?.status === 200) {
      yield put({
        type: RegistryActionType.SEARCH_SUCCESS,
        payload: res.data,
      });
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: RegistryActionType.SEARCH_ERROR,
      payload: { error: error.message },
    });
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
        searchedRegistries: registries,
      };
    case RegistryActionType.SEARCH_ERROR:
      const { error } = action.payload as RegistryError;
      return {
        ...state,
        loading: false,
        error,
      };
    case RegistryActionType.SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export function* registrySaga() {
  yield takeLatest(RegistryActionType.SEARCH, searchSaga);
}

export default registryReducer;
