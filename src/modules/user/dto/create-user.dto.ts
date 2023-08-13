import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Firstname of the user',
    example: 'toto',
  })
  public firstName?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Lastname of the user',
    example: 'toto',
  })
  public lastName?: string;
}
