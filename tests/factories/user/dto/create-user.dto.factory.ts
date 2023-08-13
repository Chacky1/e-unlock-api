import { faker } from '@faker-js/faker';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export const createFakeUserDto = (
  user: Partial<CreateUserDto> = {},
  override?: Partial<CreateUserDto>,
): CreateUserDto => ({
  code: user.code ?? faker.lorem.word(),
  email: user.email ?? faker.internet.email(),
  ...override,
});
