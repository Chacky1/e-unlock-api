import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { IsReadOnly } from '../../../shared/decorators/readonly.decorators';

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

  @IsReadOnly()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The image url of the category',
    example:
      'gs://unlocktoncomputer-learning-assets/categories/54e88873-d027-4047-b913-5ba67471bd39.png',
  })
  public imageUrl?: string;

  @IsReadOnly()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Date of creation',
    type: 'string',
    format: 'date-time',
    example: '2021-01-01T00:00:00.000Z',
  })
  public createdAt?: Date;

  @IsReadOnly()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Date of update',
    type: 'string',
    format: 'date-time',
    example: '2021-01-01T00:00:00.000Z',
  })
  public updatedAt?: Date;
}
