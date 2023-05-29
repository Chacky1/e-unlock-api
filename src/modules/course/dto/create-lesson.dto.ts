import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the lesson',
    example: 'Lesson name',
  })
  readonly name: string;

  @IsString()
  @ApiProperty({
    description: 'The description of the lesson',
    example: 'Lesson description',
  })
  readonly textContent: string;

  @IsNumber()
  @ApiProperty({
    description: 'The section id of the lesson',
    example: 0,
  })
  sectionId: number;

  @IsNumber()
  @ApiProperty({
    description: 'The order of the lesson',
    example: 1,
  })
  sectionOrder: number;

  @IsString()
  @ApiProperty({
    description: 'The video file of the lesson',
    example: 'Lesson video file',
  })
  active: boolean;
}
