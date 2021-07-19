import { ArgumentMetadata, BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';

import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  logger = new Logger('JoiValidationPipe');
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { value: transformmedValue, error } = this.schema.validate(value);
    if (error) {
      this.logger.error(error);
      throw new BadRequestException('Validation failed', error.message);
    }
    return transformmedValue;
  }
}
