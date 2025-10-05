import { Injectable } from '@nestjs/common';
import { SupportersDBService } from './DB_Services/supporters_DB.service';
import { OrderStatusEnum } from 'src/orders/enums/order_enums';

@Injectable()
export class SupportersService {
  constructor(private readonly supportersDBService: SupportersDBService) {}
  async autoPickSupporter() {
    const supportersRepo = this.supportersDBService.getSupportersRepo();

    const supportersWithOrderCounts = await supportersRepo
      .createQueryBuilder('supporter')
      .leftJoin('supporter.orders', 'order')
      .leftJoin('order.status', 'status')
      .select([
        'supporter.id',
        'supporter.first_name',
        'supporter.last_name',
        'supporter.user_name',
        'supporter.phone',
        'supporter.created_at',
        'supporter.updated_at',
      ])
      .addSelect(
        'COUNT(CASE WHEN status.status NOT IN (:...excludedStatuses) THEN 1 END)',
        'active_order_count',
      )
      .where('supporter.id IS NOT NULL')
      .groupBy('supporter.id')
      .setParameters({
        excludedStatuses: [
          OrderStatusEnum.COMPLETED,
          OrderStatusEnum.CANCELLED,
        ],
      })
      .orderBy('active_order_count', 'ASC')
      .getRawAndEntities();

    if (!supportersWithOrderCounts.entities.length) {
      return null;
    }

    const minOrderCount = supportersWithOrderCounts.raw[0].active_order_count;
    const supporterWithMinOrders = supportersWithOrderCounts.entities.find(
      (_, index) =>
        supportersWithOrderCounts.raw[index].active_order_count ===
        minOrderCount,
    );
    return supporterWithMinOrders;
  }
}
