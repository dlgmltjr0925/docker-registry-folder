import { combineReducers } from 'redux';

import user from './user';

const rootReducer = combineReducers({
  user,
});
export function* rootSaga() {}

export default rootReducer;
