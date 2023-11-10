import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { OrderService } from '../providers/services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../types/order.type';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { ErrorsInterceptor } from '../../../shared/interceptors/errors.interceptor';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:orders')
  @ApiCreatedResponse({
    type: Order,
  })
  public async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);

    return order;
  }

  @Patch(':id')
  @UseInterceptors(ErrorsInterceptor)
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('update:orders')
  @ApiOkResponse({
    type: Order,
  })
  public async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const order = await this.orderService.update(+id, updateOrderDto);

    return order;
  }
}
