import alertDialog, { AlertDialogState } from './alert-dialog';
import auth, { AuthState, authSaga } from './auth';
import layout, { LayoutState } from './layout';
import settingRegistry, { SettingRegistryState, registrySaga } from './setting-registry';
import snackBars, { SnackBarsState, snackBarsSaga } from './snack-bars';
import user, { UserState, usersSaga } from './user';

import { PersistConfig } from 'redux-persist/es/types';
import { all } from '@redux-saga/core/effects';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';

export interface RootState {
  auth: AuthState;
  layout: LayoutState;
  settingRegistry: SettingRegistryState;
  alertDialog: AlertDialogState;
  snackBars: SnackBarsState;
  user: UserState;
}

const rootReducer = combineReducers({
  auth,
  layout,
  settingRegistry,
  alertDialog,
  snackBars,
  user,
});

export function* rootSaga() {
  yield all([authSaga(), registrySaga(), snackBarsSaga(), usersSaga()]);
}

const persistConfig: PersistConfig<RootState, any, any, any> = {
  key: 'docker-registry-folder',
  storage,
  blacklist: ['registry', 'alertDialog', 'user'],
};

export default persistReducer(persistConfig, rootReducer);
