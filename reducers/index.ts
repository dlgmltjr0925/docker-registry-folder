import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { PersistConfig } from 'redux-persist/es/types';
import storage from 'redux-persist/lib/storage/session';

import { all } from '@redux-saga/core/effects';

import auth, { authSaga, AuthState } from './auth';

export interface RootState {
  auth: AuthState;
}

const rootReducer = combineReducers({
  auth,
});

export function* rootSaga() {
  yield all([authSaga()]);
}

const persistConfig: PersistConfig<RootState, any, any, any> = {
  key: 'root',
  storage,
};

export default persistReducer(persistConfig, rootReducer);
