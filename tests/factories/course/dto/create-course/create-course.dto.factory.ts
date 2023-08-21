import { faker } from '@faker-js/faker';
import { CreateCourseDto } from '../../../../../src/modules/course/dto/create-course.dto';

export const createFakeCourseDto = (
  course: Partial<CreateCourseDto> = {},
  override?: Partial<CreateCourseDto>,
): CreateCourseDto => ({
  name: course.name ?? faker.lorem.word(),
  description: course.description ?? faker.lorem.paragraph(3),
  price:
    course.price ??
    faker.number.int({
      min: 0,
      max: 100000,
    }),
  issue: course.issue ?? faker.lorem.sentence(),
  solution: course.solution ?? faker.lorem.sentence(),
  categoryId: course.categoryId ?? faker.number.int(),
  ...override,
});
