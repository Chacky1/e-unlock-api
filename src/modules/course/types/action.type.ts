import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { IsReadOnly } from '../../../shared/decorators/readonly.decorators';
import { Transform } from 'class-transformer';

export enum ActionType {
  QUESTION = 'QUESTION',
  CODE = 'CODE',
}

export class UserAction {
  @IsReadOnly()
  @ApiProperty({
    description: 'User Action id',
    readOnly: true,
    type: 'integer',
  })
  id: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'User id the action belongs to',
    readOnly: true,
    type: 'integer',
  })
  userId: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'Action id the user action belongs to',
    readOnly: true,
    type: 'integer',
  })
  actionId: number;

  @IsReadOnly()
  @ApiProperty({
    description: 'User action completion status',
    readOnly: true,
    type: 'boolean',
  })
  isCompleted: boolean;

  @IsReadOnly()
  @ApiProperty({
    description: 'User action answer',
    readOnly: true,
    type: 'string',
  })
  answer: string;

  @IsReadOnly()
  @ApiProperty({
    description: 'User action creation date',
    readOnly: true,
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @IsReadOnly()
  @ApiProperty({
    description: 'User action update date',
    readOnly: true,
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
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

  @IsReadOnly()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'User Action object with information about the user completion',
    type: 'integer',
    required: false,
    example: {
      id: 1,
      userId: 1,
      actionId: 1,
      isCompleted: true,
      answer: 'Answer',
      createdAt: '2021-07-17T19:06:58.000Z',
      updatedAt: '2021-07-17T19:06:58.000Z',
    },
  })
  userAction?: UserAction;
}

export class SearchActionQuery {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Lesson id the action belongs to',
    type: 'integer',
    required: false,
  })
  lessonId?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiPropertyOptional({
    description: 'User id the action could be completed by',
    type: 'integer',
    required: false,
  })
  userId?: number;
}
