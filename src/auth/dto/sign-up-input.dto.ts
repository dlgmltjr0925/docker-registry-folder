import Joi from 'joi';
import { Role } from '../interfaces/role.enum';

export class SignUpInputDto {
  username!: string;
  password!: string;
  role!: Role;
  systemAdmin!: boolean;
}

export const SignUpInputSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(Role.ADMIN, Role.MANAGER, Role.VIEWER).required(),
  systemAdmin: Joi.boolean().default(false),
});
