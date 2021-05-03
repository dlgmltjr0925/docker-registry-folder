import Joi from 'joi';

export class SignInInputDto {
  username!: string;
  password!: string;
}

export const SignInInputSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
