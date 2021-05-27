import axios, { AxiosResponse } from 'axios';

import { CreateRegistryDto } from '../src/registry/dto/create-registry.dto';
import { UpdateRegistryDto } from '../src/registry/dto/update-registry.dto';
import { CreateRegistryResponse, RegistryListResponse } from '../src/registry/registry.controller';

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

export const removeRegistries = (ids: number[]): Promise<AxiosResponse> => {
  try {
    return axios.delete(`${window.location.origin}/api/registry/${ids.join(',')}`);
  } catch (error) {
    throw error;
  }
};

export const addRegistry = (registry: CreateRegistryDto): Promise<AxiosResponse<CreateRegistryResponse>> => {
  try {
    return axios.post(`${window.location.origin}/api/registry`, registry);
  } catch (error) {
    throw error;
  }
};

export const updateRegistry = (registry: UpdateRegistryDto): Promise<AxiosResponse<boolean>> => {
  try {
    return axios.put(`${window.location.origin}/api/registry`, registry);
  } catch (error) {
    throw error;
  }
};
