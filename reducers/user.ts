export interface UserState {
  id: number;
}

export enum UserActionType {
  SET_USER = 'SET_USER',
  RESET_USER = 'RESET_USER',
}

interface UserAction {
  type: UserActionType;
  user: UserState;
}

export const initialState: UserState = { id: 0 };

export const setUserAction = (user: UserState) => ({
  type: UserActionType.SET_USER,
  user,
});

const reducer = (state = initialState, action: UserAction) => {
  switch (action.type) {
    case UserActionType.SET_USER:
      return action.user;
    case UserActionType.RESET_USER:
    default:
      return initialState;
  }
};

export default reducer;
