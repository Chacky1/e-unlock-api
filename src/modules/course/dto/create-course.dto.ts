import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNumber, MinLength, IsOptional } from 'class-validator';

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

  @IsString()
  @ApiProperty({
    description: 'Main issue that the course solves',
    example: 'Course issue',
  })
  public issue: string;

  @IsString()
  @ApiProperty({
    description: 'Solution that course offers',
    example: 'Course solution',
  })
  public solution: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({
    description: 'The price of the course (in cents)',
    example: 0,
  })
  public price: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The price code of the course',
    example: 'price_1O058fGtfE5rkMGLnjyDxKV8',
  })
  public priceCode?: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({
    description: 'The category id of the course',
    example: 0,
  })
  public categoryId: number;
}
