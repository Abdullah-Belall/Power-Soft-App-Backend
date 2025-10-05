import { IsEnum } from 'class-validator';
import { PrivateStatusEnum } from '../enums/order_enums';

export class ChangePrivStatusDto {
  @IsEnum(PrivateStatusEnum)
  private_status: PrivateStatusEnum;
}
