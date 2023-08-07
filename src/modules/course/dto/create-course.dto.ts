import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(1, {
    message: 'name must be longer than or equal to 1 characters',
  })
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

  @IsNumber()
  @ApiProperty({
    description: 'The category id of the course',
    example: 0,
  })
  public categoryId: number;
}
