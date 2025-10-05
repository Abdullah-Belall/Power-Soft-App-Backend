import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatusEntity } from '../entities/order_status.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class StatusDBService {
  constructor(
    @InjectRepository(OrderStatusEntity)
    private readonly statusRepo: Repository<OrderStatusEntity>,
  ) {}
  createStatusInstance(obj: DeepPartial<OrderStatusEntity>) {
    return this.statusRepo.create(obj);
  }
  async saveStatus(status: OrderStatusEntity) {
    let saved: OrderStatusEntity;
    try {
      saved = await this.statusRepo.save(status);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Error while saving status.');
    }
    return saved;
  }
}
