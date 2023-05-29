import { faker } from '@faker-js/faker';
import { CreateLessonDto } from '../../../../../src/modules/course/dto/create-lesson.dto';

export const createFakeLessonDto = (lesson: Partial<CreateLessonDto> = {}) => ({
  name: lesson.name ?? faker.lorem.word(),
  textContent: lesson.textContent ?? faker.lorem.paragraph(),
  sectionId: lesson.sectionId ?? faker.number.int(),
  sectionOrder: lesson.sectionOrder ?? faker.number.int(),
  active: lesson.active ?? faker.datatype.boolean(),
});
