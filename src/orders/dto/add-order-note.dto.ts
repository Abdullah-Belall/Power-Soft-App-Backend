import { IsString, MinLength } from 'class-validator';

export class AddOrderNoteDto {
  @IsString()
  @MinLength(6)
  note: string;
}
