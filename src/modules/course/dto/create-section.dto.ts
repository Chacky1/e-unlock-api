import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @MinLength(1, {
    message: 'name must be longer than or equal to 1 characters.',
  })
  @ApiProperty({
    description: 'The name of the section',
    example: 'Section name',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'The description of the section',
    example: 'Section description',
  })
  public description: string;

  @IsNumber()
  @ApiProperty({
    description: 'The course id of the section',
    example: 0,
  })
  public courseId: number;

  @IsNumber()
  @ApiProperty({
    description: 'The order of the section',
    example: 1,
  })
  public courseOrder: number;
}
