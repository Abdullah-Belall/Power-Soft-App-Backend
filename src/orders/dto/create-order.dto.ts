import { IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @MinLength(2)
  company_name: string;
  @IsPhoneNumber('EG')
  company_phone: string;
  @IsString()
  @MinLength(20)
  details: string;
}
