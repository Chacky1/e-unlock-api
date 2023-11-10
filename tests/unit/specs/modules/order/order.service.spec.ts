import { TestingModule, Test } from '@nestjs/testing';
import { createFakeOrderDto } from '../../../../factories/order/dto/create-order/create-order.dto.factory';
import { OrderRepository } from '../../../../../src/modules/order/providers/repositories/order.repository';
import { OrderService } from '../../../../../src/modules/order/providers/services/order.service';

describe('OrderService', () => {
  let service: OrderService;
  let repository: OrderRepository;

  const orderRepositoryMock = {
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: orderRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<OrderRepository>(OrderRepository);
  });

  describe('createOrder', () => {
    it('should create a order when called.', async () => {
      const toCreateOrder = createFakeOrderDto();

      await service.create(toCreateOrder);

      expect(repository.create).toHaveBeenCalledWith(toCreateOrder);
    });
  });

  describe('updateOrder', () => {
    it('should update an order when called.', async () => {
      const toUpdateOrder = createFakeOrderDto();
      const orderId = 1;

      await service.update(orderId, { status: toUpdateOrder.status });

      expect(repository.update).toHaveBeenCalledWith(orderId, {
        status: toUpdateOrder.status,
      });
    });
  });
});
