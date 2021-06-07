import axios, { AxiosResponse } from 'axios';

import { UserListResponse } from '../src/user/user.controller';

export const search = (keyword: string): Promise<AxiosResponse<UserListResponse>> => {
  try {
    const trimmedKeyword = keyword.trim();
    let url = `${window.location.origin}/api/user/list`;
    if (trimmedKeyword !== '') url += `/${trimmedKeyword}`;
    return axios.get(url);
  } catch (error) {
    throw error;
  }
};

export const removeUsers = (ids: number[]): Promise<AxiosResponse> => {
  try {
    return axios.delete(`${window.location.origin}/api/user/${ids.join(',')}`);
  } catch (error) {
    throw error;
  }
};
