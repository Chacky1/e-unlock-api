import { faker } from '@faker-js/faker';

import { CreateResourceDto } from '../../../../../src/modules/course/dto/create-resource.dto';

export const createFakeResourceDto = (
  resource: Partial<CreateResourceDto> = {},
  override?: Partial<CreateResourceDto>,
) => ({
  name: resource.name ?? faker.lorem.word(),
  lessonId:
    resource.lessonId ??
    faker.number.int({
      max: 1000,
    }),
  ...override,
});
