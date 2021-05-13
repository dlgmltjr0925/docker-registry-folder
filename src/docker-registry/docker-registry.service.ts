import axios, { AxiosRequestConfig } from 'axios';

import { Injectable, NotFoundException } from '@nestjs/common';

import { UnauthorizedException } from './exceptions/unauthorized.exception';

export interface CheckApiVersionArgs {
  host: string;
  username: string | null;
  password: string | null;
}

@Injectable()
export class DockerRegistryService {
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

  async checkApiVersion({ host, username, password }: CheckApiVersionArgs) {
    try {
      const config: AxiosRequestConfig = { headers: {} };
      if (username && password) {
        const token = Buffer.from(`${username}:${password}`).toString('base64');
        config.headers['Authorization'] = `Basic ${token}`;
      }
      return await axios.get(DockerRegistryService.getRegistryUrl(host), config);
    } catch (error) {
      throw DockerRegistryService.handleError(error);
    }
  }
}
