import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { DatabaseService } from '../../../config/database/providers/services/database.service';
import { UpdateOrderDto } from '../../dto/update-order.dto';
import { ResourceNotFoundError } from '../../../../shared/error/types/resource-not-found.error';

@Injectable()
export class OrderRepository {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async create(createOrderDto: CreateOrderDto) {
    const user = await this.databaseService.user.findUnique({
      where: {
        code: createOrderDto.userCode,
      },
    });

    const order = await this.databaseService.order.create({
      data: {
        courseId: createOrderDto.courseId,
        userId: user.id,
        status: createOrderDto.status,
      },
    });

    await this.databaseService.userCourse.create({
      data: {
        courseId: createOrderDto.courseId,
        userId: user.id,
      },
    });

    return order;
  }

  public async update(orderId: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.databaseService.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new ResourceNotFoundError('ORDER', `${orderId}`);
    }

    const updatedOrder = await this.databaseService.order.update({
      where: {
        id: orderId,
      },
      data: {
        ...updateOrderDto,
      },
    });

    return updatedOrder;
  }
}
