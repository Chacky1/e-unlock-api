import { faker } from '@faker-js/faker';
import { CreateOrderDto } from '../../../../../src/modules/order/dto/create-order.dto';
import { OrderStatus } from '../../../../../src/modules/order/types/order.type';

export const createFakeOrderDto = (
  order: Partial<CreateOrderDto> = {},
  override?: Partial<CreateOrderDto>,
): CreateOrderDto => ({
  userCode: order.userCode ?? faker.string.uuid(),
  courseId: order.courseId ?? faker.number.int(),
  status: order.status ?? faker.helpers.enumValue(OrderStatus),
  ...override,
});
