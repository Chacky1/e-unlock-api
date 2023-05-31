import { faker } from '@faker-js/faker';
import { CreateSectionDto } from '../../../../../src/modules/course/dto/create-section.dto';

export const createFakeSectionDto = (
  section: Partial<CreateSectionDto> = {},
  override?: Partial<CreateSectionDto>,
) => ({
  name:
    section.name ??
    faker.lorem.word({
      length: 100,
    }),
  description: section.description ?? faker.lorem.paragraph(3),
  courseId:
    section.courseId ??
    faker.number.int({
      max: 1000,
    }),
  courseOrder:
    section.courseOrder ??
    faker.number.int({
      max: 1000,
    }),
  ...override,
});
