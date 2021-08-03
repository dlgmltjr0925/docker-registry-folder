import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

import { UnauthorizedException } from './exceptions/unauthorized.exception';
import { stringify } from 'query-string';

export interface RegistryAccessInfo {
  host: string;
  username?: string | null;
  password?: string | null;
  token?: string | null;
}

export interface GetRepositoriesArgs extends RegistryAccessInfo {
  n?: number;
  last?: string;
}

export interface GetTagsArgs extends RegistryAccessInfo {
  name: string;
  n?: number;
  last?: string;
}

@Injectable()
export class DockerRegistryService {
  logger = new Logger('DockerRegistryService');
  static getRegistryUrl(host: string, path: string = '/') {
    return `https://${host}/v2${path}`;
  }

  static handleError(error: any) {
    const errors = error.response?.data?.errors;
    if (errors) {
      /**
       * docker registry error
       */
      for (const { code } of errors) {
        if (code === 'UNAUTHORIZED') {
          return new UnauthorizedException();
        }
      }
    } else if (error.code === 'ENOTFOUND') {
      /**
       * getaddrinfo ENOTFOUND error
       */
      return new NotFoundException();
    }

    return error;
  }

  async checkApiVersion({ host, username = null, password = null, token = null }: RegistryAccessInfo) {
    try {
      const config: AxiosRequestConfig = { headers: {} };
      if (token) {
        config.headers['Authorization'] = `Basic ${token}`;
      } else if (username && password) {
        const token = Buffer.from(`${username}:${password}`).toString('base64');
        config.headers['Authorization'] = `Basic ${token}`;
      }
      return await axios.get(DockerRegistryService.getRegistryUrl(host), config);
    } catch (error) {
      throw DockerRegistryService.handleError(error);
    }
  }

  async getRepositories({ host, username = null, password = null, token = null, n, last }: GetRepositoriesArgs) {
    try {
      const config: AxiosRequestConfig = { headers: {} };
      if (token) {
        config.headers['Authorization'] = `Basic ${token}`;
      } else if (username && password) {
        const token = Buffer.from(`${username}:${password}`).toString('base64');
        config.headers['Authorization'] = `Basic ${token}`;
      }
      let url = '/_catalog';
      const query = stringify({ n, last });
      if (query) url += `?${query}`;
      return await axios.get<{ repositories: string[] }>(DockerRegistryService.getRegistryUrl(host, url), config);
    } catch (error) {
      throw DockerRegistryService.handleError(error);
    }
  }

  async getTags({ host, username = null, password = null, token = null, n, last, name }: GetTagsArgs) {
    try {
      const config: AxiosRequestConfig = { headers: {} };
      if (token) {
        config.headers['Authorization'] = `Basic ${token}`;
      } else if (username && password) {
        const token = Buffer.from(`${username}:${password}`).toString('base64');
        config.headers['Authorization'] = `Basic ${token}`;
      }
      let url = `/${name}/tags/list`;
      const query = stringify({ n, last });
      if (query) url += `?${query}`;
      return await axios.get<{ name: string; tags: string[] | null }>(
        DockerRegistryService.getRegistryUrl(host, url),
        config
      );
    } catch (error) {
      throw DockerRegistryService.handleError(error);
    }
  }
}
