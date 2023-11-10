import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { OrderStatus } from '../types/order.type';

export class CreateOrderDto {
  @IsNumber()
  @ApiProperty({
    description: 'The course id of the order',
    example: 0,
  })
  public courseId: number;

  @IsString()
  @ApiProperty({
    description: 'The user id of the order',
    example: '0',
  })
  public userCode: string;

  @IsEnum(OrderStatus)
  @ApiProperty({
    description: 'The status of the order',
    example: 'PENDING',
    enum: OrderStatus,
  })
  public status: OrderStatus;
}
