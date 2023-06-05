import { IsString } from 'class-validator';

export class UploadResponse {
  @IsString()
  public path: string;

  @IsString()
  public url: string;

  @IsString()
  public name: string;
}
