import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ActionType } from '../types/action.type';

export class CreateActionDto {
  @IsString()
  @ApiProperty({
    description: 'Action description as it will be displayed to the user',
    type: String,
  })
  public description: string;

  @IsEnum(ActionType)
  @ApiProperty({
    description: 'Action type',
    type: String,
    enum: ActionType,
  })
  public type: ActionType;

  @IsNumber()
  @ApiProperty({
    description: 'Lesson id',
    type: Number,
  })
  public lessonId: number;

  @IsNumber()
  @ApiProperty({
    description: 'Action order to be displayed to the user',
    type: Number,
  })
  public order: number;
}
