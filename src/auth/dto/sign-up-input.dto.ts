import Joi from 'joi';

export class SignUpInputDto {
  username!: string;
  password!: string;
  role!: 'ADMIN' | 'MANAGER' | 'VIEWER';
  systemAdmin!: boolean;
}

export const SignUpInputSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('ADMIN', 'MANAGER', 'VIEWER').required(),
  systemAdmin: Joi.boolean().default(false),
});
