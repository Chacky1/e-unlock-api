import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @MinLength(1, {
    message: 'name must be longer than or equal to 1 characters',
  })
  @ApiProperty({
    description: 'The name of the resource',
    example: 'Resource name',
  })
  public name: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    description: 'The lesson id the resource should be attached to',
    example: 1,
  })
  public lessonId: number;
}
