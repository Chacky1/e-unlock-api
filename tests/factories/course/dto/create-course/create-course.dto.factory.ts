import { faker } from '@faker-js/faker';
import { CreateCourseDto } from '../../../../../src/modules/course/dto/create-course.dto';

export const createFakeCourseDto = (
  course: Partial<CreateCourseDto> = {},
): CreateCourseDto => ({
  name: course.name ?? faker.lorem.word(),
  description: course.description ?? faker.lorem.paragraph(),
  price: course.price ?? faker.number.int(),
  duration: course.duration ?? faker.number.int(),
  videoUrl: course.videoUrl ?? faker.internet.url(),
});
