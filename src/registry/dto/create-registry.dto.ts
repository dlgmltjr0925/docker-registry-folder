import Joi from 'joi';

export class CreateRegistryDto {
  name!: string;
  host!: string;
  auth!: string | null;
  tag!: string | null;
}

export const CreateRegistrySchema = Joi.object({
  name: Joi.string().required(),
  host: Joi.string().required(),
  auth: Joi.string(),
  tag: Joi.string(),
});
