import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../entities/customer.entity';

@Injectable()
export class CustomersDBService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}
  getCustomerRepo() {
    return this.customerRepository;
  }
  async createCustomerInstance(obj: any) {
    return this.customerRepository.create(obj);
  }
  async saveCustomer(customer: CustomerEntity) {
    let saved: CustomerEntity;
    try {
      await this.customerRepository.save(customer);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Error while saving new customer');
    }
  }
  async findOneCustomer(where: any, relations?: string[], select?: any) {
    const customer = await this.customerRepository.findOne({
      where,
      relations,
      select,
    });
    if (!customer) {
      throw new NotFoundException('Customer with those info not found.');
    }
    return customer;
  }
}
