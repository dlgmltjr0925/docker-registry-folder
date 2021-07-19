import Joi from 'joi';
import { Role } from '../../auth/interfaces/role.enum';
export class UpdateUserDto {
  id!: number;
  password?: string;
  role!: Role;
  systemAdmin!: boolean;
}

export const UpdateUserSchema = Joi.object({
  id: Joi.number().required(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().required(),
  systemAdmin: Joi.boolean().required(),
});
