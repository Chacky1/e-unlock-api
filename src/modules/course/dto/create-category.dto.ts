import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(1, {
    message: 'name must be longer than or equal to 1 characters',
  })
  @ApiProperty({
    description: 'The name of the category',
    example: 'Category name',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'The description of the category',
    example: 'Category description',
  })
  public description: string;
}
