import { ObjectSchema } from 'joi';

import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    console.log('JoiValidationPipeTransform', value);
    const { value: transformmedValue, error } = this.schema.validate(value);
    if (error) throw new BadRequestException('Validation failed');
    return transformmedValue;
  }
}
