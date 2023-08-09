import { ApiProperty } from '@nestjs/swagger';
import { IsReadOnly } from '../../../shared/decorators/readonly.decorators';
import { SectionWithLessons } from './section.type';

export class Course {
  @IsReadOnly()
  @ApiProperty({
    description: 'The id of the course',
    example: 0,
  })
  public id: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'The name of the course',
    example: 'Course name',
  })
  public name: string;

  @IsReadOnly()
  @ApiProperty({
    description: 'The description of the course',
    example: 'Course description',
  })
  public description: string;

  @IsReadOnly()
  @ApiProperty({
    description: 'Main issue that the course solves',
    example: 'Course issue',
  })
  public issue: string;

  @IsReadOnly()
  @ApiProperty({
    description: 'The price of the course (in cents)',
    example: 0,
  })
  public price: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'The category id of the course',
    example: 0,
  })
  public categoryId: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'The creation date of the course',
    type: 'string',
    format: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  public createdAt: Date;

  @IsReadOnly()
  @ApiProperty({
    description: 'The update date of the course',
    type: 'string',
    format: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  public updatedAt: Date;
}

export class CourseWithSections extends Course {
  @IsReadOnly()
  @ApiProperty({
    description: 'The sections of the course',
    type: SectionWithLessons,
    isArray: true,
  })
  public sections: SectionWithLessons[];
}