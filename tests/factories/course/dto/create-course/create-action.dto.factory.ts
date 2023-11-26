import { faker } from '@faker-js/faker';
import { CreateActionDto } from '../../../../../src/modules/course/dto/create-action.dto';
import { ActionType } from '../../../../../src/modules/course/types/action.type';

export const createFakeActionDto = (
  action: Partial<CreateActionDto> = {},
  overrides?: Partial<CreateActionDto>,
): CreateActionDto => ({
  description: action.description ?? faker.lorem.sentence(),
  type: action.type ?? faker.helpers.enumValue(ActionType),
  lessonId: action.lessonId ?? faker.number.int(),
  order: action.order ?? faker.number.int(100),
  ...action,
  ...overrides,
});
