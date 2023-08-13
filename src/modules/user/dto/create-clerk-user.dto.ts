import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ClerkEmailAddresses {
  @IsString()
  @ApiProperty({
    description: 'Email of the user',
    example: 'toto@test.com',
  })
  public email_address: string;
}

export class CreateClerkUserDto {
  @IsString()
  @ApiProperty({
    description: 'Clerk ID of the user',
    example: '1234567890',
  })
  public id: string;

  @IsArray()
  @ApiProperty({
    description: 'Emails of the user',
    example: [
      {
        email_address: 'toto@test.com',
      },
    ],
  })
  public email_addresses: ClerkEmailAddresses[];

  @IsArray()
  @ApiProperty({
    description: 'Firstname of the user',
    example: 'toto',
  })
  public first_name: string;

  @IsArray()
  @ApiProperty({
    description: 'Lastname of the user',
    example: 'toto',
  })
  public last_name: string;
}
