import { IsString, MinLength } from 'class-validator';

export class AddCustomerNoteDto {
  @IsString()
  @MinLength(5)
  note: string;
}
