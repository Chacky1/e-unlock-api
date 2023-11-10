import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../types/order.type';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiPropertyOptional({
    description: 'The status of the order',
    example: 'pending',
    enum: OrderStatus,
  })
  public status?: OrderStatus;
}
