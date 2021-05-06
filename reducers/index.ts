import { combineReducers } from 'redux';

import { all } from '@redux-saga/core/effects';

import user, { userSaga, UserState } from './user';

export interface RootState {
  user: UserState;
}

const rootReducer = combineReducers({
  user,
});

export function* rootSaga() {
  yield all([userSaga()]);
}

export default rootReducer;
