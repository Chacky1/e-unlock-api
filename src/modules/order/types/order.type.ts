import { ApiProperty } from '@nestjs/swagger';
import { IsReadOnly } from '../../../shared/decorators/readonly.decorators';

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class Order {
  @IsReadOnly()
  @ApiProperty({
    description: 'The id of the order',
    example: 0,
  })
  id: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'The course id of the order',
    example: 0,
  })
  courseId: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'The user id of the order',
    example: 0,
  })
  userId: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'The status of the order',
    example: 'PENDING',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @IsReadOnly()
  @ApiProperty({
    description: 'The date the order was created',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @IsReadOnly()
  @ApiProperty({
    description: 'The date the order was updated',
    example: '2021-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
