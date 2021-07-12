import Joi from 'joi';

export class UpdateProfileDto {
  id!: number;
  username!: string;
  password!: string;
}

export const UpdateProfileSchema = Joi.object({
  id: Joi.number().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});
