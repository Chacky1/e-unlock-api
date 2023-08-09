import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class Category {
  @ApiProperty({
    description: 'The name of the category',
    example: "Category's name",
  })
  public name: string;

  @ApiProperty({
    description: 'The description of the category',
    example: "Category's description",
  })
  public description: string;

  @ApiProperty({
    description: 'The hex color of the category (will be used as background)',
    example: '#000000',
  })
  public color: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'The image url of the category',
    example: 'https://www.youtube.com/watch?v=0oGcWm1T1Lw',
  })
  public image?: string;
}
