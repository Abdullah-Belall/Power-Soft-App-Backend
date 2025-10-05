import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CustomerOrderNoteEntity } from '../entities/customer_order_note.entity';

@Injectable()
export class CustomerOrderNotesDBService {
  constructor(
    @InjectRepository(CustomerOrderNoteEntity)
    private readonly customerOrderNoteRepo: Repository<CustomerOrderNoteEntity>,
  ) {}
  createCustomerOrderNoteInstance(
    obj: DeepPartial<CustomerOrderNoteEntity>,
  ): CustomerOrderNoteEntity {
    return this.customerOrderNoteRepo.create(obj);
  }
  async saveCustomerOrderNoteInstance(order: CustomerOrderNoteEntity) {
    let saved: CustomerOrderNoteEntity;
    try {
      saved = await this.customerOrderNoteRepo.save(order);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Error while saving order.');
    }
    return saved;
  }
}
