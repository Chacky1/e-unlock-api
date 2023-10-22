import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDto } from '../../dto/create-order.dto';

@Injectable()
export class OrderService {
  public constructor(private readonly orderRepository: OrderRepository) {}

  public async create(createOrderDto: CreateOrderDto) {
    const order = await this.orderRepository.create(createOrderDto);

    return order;
  }
}
