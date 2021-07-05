import { CreateUserDto } from './create-user.dto';
import Joi from 'joi';
import { Role } from '../../auth/interfaces/role.enum';

export class UpdateUserDto extends CreateUserDto {
  id!: number;
}

export const UpdateRegistrySchema = Joi.object({
  id: Joi.number().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});
