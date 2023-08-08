import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class Category {
  @IsString()
  @ApiProperty({
    description: 'The name of the category',
    example: "Category's name",
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'The description of the category',
    example: "Category's description",
  })
  public description: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The image url of the category',
    example: 'https://www.youtube.com/watch?v=0oGcWm1T1Lw',
  })
  public image?: string;
}
