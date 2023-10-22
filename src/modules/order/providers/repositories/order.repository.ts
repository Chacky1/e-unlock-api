import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { DatabaseService } from '../../../config/database/providers/services/database.service';

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
}
