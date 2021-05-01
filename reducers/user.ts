export interface UserState {
  id: number;
}

export enum UserReducerActionType {
  SET_USER = 'SET_USER',
  RESET_USER = 'RESET_USER',
}

interface UserReducerAction {
  type: UserReducerActionType;
  user: UserState;
}

export const initialState: UserState = { id: 0 };

export const setUserAction = (user: UserState) => ({
  type: UserReducerActionType.SET_USER,
  user,
});

const reducer = (state = initialState, action: UserReducerAction) => {
  switch (action.type) {
    case UserReducerActionType.SET_USER:
      return action.user;
    case UserReducerActionType.RESET_USER:
    default:
      return initialState;
  }
};

export default reducer;
