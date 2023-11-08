import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsReadOnly } from '../../../shared/decorators/readonly.decorators';
import { IsOptional } from 'class-validator';

export class Resource {
  @IsReadOnly()
  @ApiProperty({
    description: 'The id of the resource',
    example: 0,
  })
  public id: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'The name of the resource',
    example: 'Course name',
  })
  public name: string;

  @IsReadOnly()
  @ApiProperty({
    description: 'The url of the resource',
    example: 'https://www.google.com',
  })
  public url: string;

  @IsReadOnly()
  @ApiProperty({
    description: 'The lesson id the resource should be attached to',
    example: 1,
  })
  public lessonId: number;

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

export class ResourceQuerySearch {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The id of the resource',
    example: 0,
  })
  public id: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'The name of the resource',
    example: 'Course name',
  })
  public name: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'The lesson id the resource should be attached to',
    example: 1,
  })
  public lessonId: number;
}
