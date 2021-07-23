import { ArgumentMetadata, Injectable, Logger, PipeTransform } from '@nestjs/common';

import { ObjectSchema } from 'joi';
import { ValidationException } from './exceptions/validation.exception';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  logger = new Logger('JoiValidationPipe');
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { value: transformmedValue, error } = this.schema.validate(value);
    if (error) {
      this.logger.error(error);
      throw new ValidationException(error.message);
    }
    return transformmedValue;
  }
}
