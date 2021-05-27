import axios, { AxiosResponse } from 'axios';

import {
    CreateRegistryResponse
} from '../.next/production-server/src/registry/registry.controller.d';
import { CreateRegistryDto } from '../src/registry/dto/create-registry.dto';
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
