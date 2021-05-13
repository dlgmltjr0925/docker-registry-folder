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
  username: Joi.string().default(null),
  password: Joi.string().default(null),
  tag: Joi.string().default(null),
});
