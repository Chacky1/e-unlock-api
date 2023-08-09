import { ApiProperty } from '@nestjs/swagger';
import { IsReadOnly } from '../../../shared/decorators/readonly.decorators';
import { Lesson } from './lesson.type';

export class Section {
  @IsReadOnly()
  @ApiProperty({
    description: 'The name of the section',
    example: 'Section name',
  })
  public name: string;

  @IsReadOnly()
  @ApiProperty({
    description: 'The description of the section',
    example: 'Section description',
  })
  public description: string;

  @IsReadOnly()
  @ApiProperty({
    description: 'The order of the section',
    example: 1,
  })
  public order: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'The creation date of the section',
    type: 'string',
    format: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  public createdAt: Date;

  @IsReadOnly()
  @ApiProperty({
    description: 'The update date of the section',
    type: 'string',
    format: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  public updatedAt: Date;
}

export class SectionWithLessons extends Section {
  @IsReadOnly()
  @ApiProperty({
    description: 'The lessons of the section',
    type: Lesson,
    isArray: true,
  })
  public lessons: Lesson[];
}
