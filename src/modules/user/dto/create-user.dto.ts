import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'External ID of the user',
    example: '1234567890',
  })
  public code: string;

  @IsString()
  @ApiProperty({
    description: 'Email of the user',
    example: 'toto@test.fr',
  })
  public email: string;
}
