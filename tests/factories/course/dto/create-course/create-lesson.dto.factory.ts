import { faker } from '@faker-js/faker';
import { CreateLessonDto } from '../../../../../src/modules/course/dto/create-lesson.dto';

export const createFakeLessonDto = (
  lesson: Partial<CreateLessonDto> = {},
  override?: Partial<CreateLessonDto>,
) => ({
  name: lesson.name ?? faker.lorem.word(),
  textContent: lesson.textContent ?? faker.lorem.paragraph(3),
  sectionId:
    lesson.sectionId ??
    faker.number.int({
      max: 1000,
    }),
  sectionOrder:
    lesson.sectionOrder ??
    faker.number.int({
      max: 1000,
    }),
  ...override,
});
