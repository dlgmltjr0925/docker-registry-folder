import Joi from 'joi';

export class CreateRegistryDto {
  name!: string;
  host!: string;
  username!: string | null;
  password!: string | null;
  tag!: string | null;
}

export const CreateRegistrySchema = Joi.object({
  name: Joi.string().required(),
  host: Joi.string().required(),
  username: Joi.string().allow(null).default(null),
  password: Joi.string().allow(null).default(null),
  tag: Joi.string().allow(null).default(null),
});
