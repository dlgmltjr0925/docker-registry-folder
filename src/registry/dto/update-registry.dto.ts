import Joi from 'joi';

import { CreateRegistryDto } from './create-registry.dto';

export class UpdateRegistryDto extends CreateRegistryDto {
  id!: number;
}

export const UpdateRegistrySchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  host: Joi.string().required(),
  username: Joi.string().default(null),
  password: Joi.string().default(null),
  tag: Joi.string().default(null),
});
