import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the course',
    example: 'Course name',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'The description of the course',
    example: 'Course description',
  })
  public description: string;

  @IsNumber()
  @ApiProperty({
    description: 'The price of the course (in cents)',
    example: 0,
  })
  public price: number;

  @IsNumber()
  @ApiProperty({
    description: 'The duration of the course (in hours)',
    example: 0,
  })
  public duration: number;
}
