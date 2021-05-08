import axios, { AxiosResponse } from 'axios';
import { SignInInputDto } from 'src/auth/dto/sign-in-input.dto';

import { SignUpInputDto } from '../src/auth/dto/sign-up-input.dto';

export interface SignResponseData {
  accessToken: string;
}

export const signUp = (signUpInput: SignUpInputDto): Promise<AxiosResponse<SignResponseData>> => {
  try {
    return axios.post(`${window.location.origin}/api/auth/sign-up`, signUpInput);
  } catch (error) {
    throw error;
  }
};

export const signIn = (signInInput: SignInInputDto): Promise<AxiosResponse<SignResponseData>> => {
  try {
    return axios.post(`${window.location.origin}/api/auth/sign-in`, signInInput);
  } catch (error) {
    throw error;
  }
};

export const signOut = (): Promise<AxiosResponse<{}>> => {
  try {
    return axios.post(`${window.location.origin}/api/auth/sign-out`);
  } catch (error) {
    throw error;
  }
};
