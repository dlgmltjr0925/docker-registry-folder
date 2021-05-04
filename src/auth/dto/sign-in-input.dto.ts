import Joi from 'joi';

export class SignInInputDto {
  username!: string;
  password!: string;
}
