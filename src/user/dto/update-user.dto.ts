import { CreateUserDto } from './create-user.dto';
import Joi from 'joi';
export class UpdateUserDto extends CreateUserDto {
  id!: number;
  systemAdmin!: boolean;
}

export const UpdateUserSchema = Joi.object({
  id: Joi.number().required(),
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
  systemAdmin: Joi.boolean().required(),
});
