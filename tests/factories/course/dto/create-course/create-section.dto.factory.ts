import { faker } from '@faker-js/faker';
import { CreateSectionDto } from '../../../../../src/modules/course/dto/create-section.dto';

export const createFakeSectionDto = (
  section: Partial<CreateSectionDto> = {},
) => ({
  name: section.name ?? faker.lorem.word(),
  description: section.description ?? faker.lorem.paragraph(),
  courseId: section.courseId ?? faker.number.int(),
  courseOrder: section.courseOrder ?? faker.number.int(),
});
