import { UserDto } from '../src/auth/dto/user.dto';

interface SearchedUser extends UserDto {
  loading: boolean;
}

interface SearchState {
  loading: boolean;
  keyword: string;
  searchedUsers: SearchedUser[];
}

export interface UsersState {
  search: SearchState;
}

enum UsersActionType {
  SEARCH = 'SEARCH',
  SEARCH_SUCCESS = 'SEARCH_SUCCESS',
  SEARCH_ERROR = 'SEARCH_ERROR',
}

interface Keyword {
  keyword: string;
}

type Payload = Keyword;

interface UsersAction<T = Payload> {
  type: UsersActionType;
  payload: T;
}

export const search = (keyword: string) => ({
  type: UsersActionType.SEARCH,
  payload: { keyword },
});
