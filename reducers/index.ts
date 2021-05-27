import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { PersistConfig } from 'redux-persist/es/types';
import storage from 'redux-persist/lib/storage/session';

import { all } from '@redux-saga/core/effects';

import alertDialog, { AlertDialogState } from './alert-dialog';
import auth, { authSaga, AuthState } from './auth';
import layout, { LayoutState } from './layout';
import registry, { registrySaga, RegistryState } from './registry';

export interface RootState {
  auth: AuthState;
  layout: LayoutState;
  registry: RegistryState;
  alertDialog: AlertDialogState;
}

const rootReducer = combineReducers({
  auth,
  layout,
  registry,
  alertDialog,
});

export function* rootSaga() {
  yield all([authSaga(), registrySaga()]);
}

const persistConfig: PersistConfig<RootState, any, any, any> = {
  key: 'docker-registry-folder',
  storage,
  blacklist: ['registry', 'alertDialog'],
};

export default persistReducer(persistConfig, rootReducer);
