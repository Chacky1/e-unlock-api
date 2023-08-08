import { IsEmpty, ValidationOptions } from 'class-validator';

export const IsReadOnly = (options: ValidationOptions = {}) => {
  const factory = IsEmpty({ ...options, message: '$property is read-only' });

  return factory;
};
