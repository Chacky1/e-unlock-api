import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class Lesson {
  @IsString()
  @ApiProperty({
    description: 'The name of the lesson',
    example: 'Lesson name',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'The description of the lesson',
    example: 'Lesson description',
  })
  public textContent: string;

  @IsNumber()
  @ApiProperty({
    description: 'The section id of the lesson',
    example: 0,
  })
  public sectionId: number;

  @IsNumber()
  @ApiProperty({
    description: 'The order of the lesson',
    example: 1,
  })
  public sectionOrder: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The video url of the lesson',
    example: 'https://www.youtube.com/watch?v=0oGcWm1T1Lw',
  })
  public videoUrl: string;
}
