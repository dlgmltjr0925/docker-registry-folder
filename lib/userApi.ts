import { CreateUserResponse, UserListResponse } from '../src/user/user.controller';
import axios, { AxiosResponse } from 'axios';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

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

export const addUser = (user: CreateUserDto): Promise<AxiosResponse<CreateUserResponse>> => {
  try {
    return axios.post(`${window.location.origin}/api/user`, user);
  } catch (error) {
    throw error;
  }
};

export const updateUser = (user: UpdateUserDto): Promise<AxiosResponse<boolean>> => {
  try {
    return axios.put(`${window.location.origin}/api/user`, user);
  } catch (error) {
    throw error;
  }
};
