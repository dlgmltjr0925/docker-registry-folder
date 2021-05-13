import { Role } from 'src/auth/interfaces/role.enum';

import { BadRequestException } from '@nestjs/common';

import { SignUpInputDto, SignUpInputSchema } from '../../auth/dto/sign-up-input.dto';
import { JoiValidationPipe } from './joi-validation.pipe';

describe('JoiValidationPipe', () => {
  let joiValidationPipe: JoiValidationPipe;

  it('should be changed to match the schema', () => {
    const joiValidationPipe = new JoiValidationPipe(SignUpInputSchema);
    const inputValue: Partial<SignUpInputDto> = {
      username: 'test',
      password: 'test',
      role: Role.ADMIN,
    };
    const result = joiValidationPipe.transform(inputValue, { type: 'body' });
    expect(result).toEqual({
      ...inputValue,
      systemAdmin: false,
    });
  });

  it('should be got error, if you enter an invalid value', () => {
    const joiValidationPipe = new JoiValidationPipe(SignUpInputSchema);
    const inputValue: Partial<SignUpInputDto> = {
      username: 'test',
      password: 'test',
    };
    try {
      joiValidationPipe.transform(inputValue, { type: 'body' });
    } catch (error) {
      expect(error).toEqual(new BadRequestException('Validation failed'));
    }
  });
});
