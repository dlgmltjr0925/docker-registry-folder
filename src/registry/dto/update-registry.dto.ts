import Joi from 'joi';

import { CreateRegistryDto } from './create-registry.dto';

export class UpdateRegistryDto extends CreateRegistryDto {
  id!: number;
}

export const UpdateRegistrySchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  host: Joi.string().required(),
  username: Joi.string().allow(null).default(null),
  password: Joi.string().allow(null).default(null),
  tag: Joi.string().allow(null).default(null),
});
