import axios, { AxiosResponse } from 'axios';

import { SignUpInputDto } from '../src/auth/dto/sign-up-input.dto';

interface SignUpResponseData {
  accessToken: string;
}

export const signUp = (signUpInput: SignUpInputDto): Promise<AxiosResponse<SignUpResponseData>> => {
  try {
    return axios.post(`${window.location.origin}/api/auth/sign-up`, signUpInput);
  } catch (error) {
    throw error;
  }
};
