import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatusEnum } from '../enums/order_enums';

export class ChangeOrderStatusDto {
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;
  @IsString()
  @IsOptional()
  note: string;
}
