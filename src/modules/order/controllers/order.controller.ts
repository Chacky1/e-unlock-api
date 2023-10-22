import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse } from '@nestjs/swagger';

import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { OrderService } from '../providers/services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:orders')
  @ApiCreatedResponse({
    type: CreateOrderDto,
  })
  public async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);

    return order;
  }
}
