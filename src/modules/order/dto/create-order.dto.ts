import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

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

  @IsString()
  @ApiProperty({
    description: 'The status of the order',
    example: 'pending',
  })
  public status: string;
}
