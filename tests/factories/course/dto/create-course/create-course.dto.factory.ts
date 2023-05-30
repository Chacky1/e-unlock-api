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
  duration:
    course.duration ??
    faker.number.int({
      min: 0,
      max: 1000,
    }),
  ...override,
});
