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
