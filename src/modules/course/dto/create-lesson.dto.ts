import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, MinLength } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @MinLength(1, {
    message: 'name must be longer than or equal to 1 characters.',
  })
  @ApiProperty({
    description: 'The name of the lesson',
    example: 'Lesson name',
  })
  public name: string;

  @IsString()
  @MinLength(1, {
    message: 'textContent must be longer than or equal to 1 characters.',
  })
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
}
