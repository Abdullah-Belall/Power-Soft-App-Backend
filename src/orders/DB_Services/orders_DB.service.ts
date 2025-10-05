import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.entity';
import { Repository, DeepPartial } from 'typeorm';

@Injectable()
export class OrdersDBService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepo: Repository<OrderEntity>,
  ) {}
  getOrdersRepo() {
    return this.ordersRepo;
  }
  createOrderInstance(obj: DeepPartial<OrderEntity>): OrderEntity {
    return this.ordersRepo.create(obj);
  }
  async saveOrder(order: OrderEntity) {
    let saved: OrderEntity;
    try {
      saved = await this.ordersRepo.save(order);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Error while saving order.');
    }
    return saved;
  }
  async findOneOrder(options: object) {
    const order = await this.ordersRepo.findOne(options);
    return order;
  }
}
