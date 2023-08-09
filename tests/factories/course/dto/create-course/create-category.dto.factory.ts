import { faker } from '@faker-js/faker';
import { CreateCategoryDto } from '../../../../../src/modules/course/dto/create-category.dto';

export const createFakeCategoryDto = (
  category: Partial<CreateCategoryDto> = {},
  override?: Partial<CreateCategoryDto>,
): CreateCategoryDto => ({
  name: category.name ?? faker.lorem.word(),
  description: category.description ?? faker.lorem.paragraph(3),
  color: category.color ?? faker.internet.color(),
  ...override,
});
