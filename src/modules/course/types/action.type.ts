import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { IsReadOnly } from 'src/shared/decorators/readonly.decorators';

export enum ActionType {
  QUESTION = 'QUESTION',
  CODE = 'CODE',
}

export class Action {
  @IsReadOnly()
  @ApiProperty({
    description: 'Action id',
    readOnly: true,
    type: 'integer',
  })
  id: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'Action description',
    type: 'string',
  })
  description: string;

  @IsReadOnly()
  @ApiProperty({
    description: 'Action type',
    enum: ActionType,
    readOnly: true,
  })
  type: ActionType;

  @IsReadOnly()
  @ApiProperty({
    description: 'Action order for a lesson',
    readOnly: true,
    type: 'integer',
  })
  order: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'Lesson id the action belongs to',
    readOnly: true,
    type: 'integer',
  })
  lessonId: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'Action creation date',
    readOnly: true,
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @IsReadOnly()
  @ApiProperty({
    description: 'Action update date',
    readOnly: true,
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}

export class SearchActionQuery {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Lesson id the action belongs to',
    type: 'integer',
    required: false,
  })
  lessonId?: number;
}
