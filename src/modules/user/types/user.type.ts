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
