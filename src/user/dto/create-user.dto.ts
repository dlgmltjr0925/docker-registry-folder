import Joi from 'joi';
import { Role } from '../../auth/interfaces/role.enum';

export class CreateUserDto {
  username!: string;
  password!: string;
  role!: Role;
}

export const CreateUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});
