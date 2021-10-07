import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { ValidationException } from 'src/exceptions/validation.exception';

export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.map(
        (err) =>
          `${err.property} - ${Object.values(err.constraints).join(', ')}`,
      );
      throw new ValidationException(messages);
    }

    return value;
  }
}
