import axios, { AxiosResponse } from 'axios';

import { RegistryListResponse } from '../src/registry/registry.controller';

export const search = (keyword: string): Promise<AxiosResponse<RegistryListResponse>> => {
  try {
    const trimmedKeyword = keyword.trim();
    let url = `${window.location.origin}/api/registry/list`;
    if (trimmedKeyword !== '') url += `/${trimmedKeyword}`;
    return axios.get(url);
  } catch (error) {
    throw error;
  }
};

export const remove = (id: number): Promise<AxiosResponse> => {
  try {
    return axios.delete(`${window.location.origin}/api/registry/${id}`);
  } catch (error) {
    throw error;
  }
};