import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CompleteActionDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Answer from the user to complete the action',
    example: 'toto',
  })
  public answer?: string;
}
