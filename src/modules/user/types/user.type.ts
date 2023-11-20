import { IsReadOnly } from '../../../shared/decorators/readonly.decorators';
import { Course } from '../../course/types/course.type';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @IsReadOnly()
  @ApiProperty({
    description: 'The internal id of the user',
    example: 1,
    type: 'number',
  })
  id: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'The external id of the user',
    example: '1',
    type: 'string',
  })
  code: string;

  @IsReadOnly()
  @ApiProperty({
    description: 'The email of the user',
    example: 'John Doe',
    type: 'string',
  })
  email: string;

  @IsReadOnly()
  @ApiProperty({
    description: 'The courses of the user',
    type: Course,
    isArray: true,
  })
  courses: Course[];
}

export class UserLesson {
  @IsReadOnly()
  @ApiProperty({
    description: 'The internal id of a user lesson connection',
    example: 1,
    type: 'number',
  })
  id: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'The id of the user',
    example: 1,
    type: 'number',
  })
  userId: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'The id of the lesson',
    example: 1,
    type: 'number',
  })
  lessonId: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'The completion status of the lesson',
    example: false,
    type: 'boolean',
  })
  isCompleted: boolean;

  @IsReadOnly()
  @ApiProperty({
    description: 'The date the user started the lesson',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
  })
  createdAt: Date;

  @IsReadOnly()
  @ApiProperty({
    description: 'The date the user finished (or change status of) the lesson',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
  })
  updatedAt: Date;
}
