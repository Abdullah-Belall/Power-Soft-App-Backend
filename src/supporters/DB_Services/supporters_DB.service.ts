import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupporterEntity } from '../entities/supporter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SupportersDBService {
  constructor(
    @InjectRepository(SupporterEntity)
    private readonly supportersRepo: Repository<SupporterEntity>,
  ) {}
  getSupportersRepo() {
    return this.supportersRepo;
  }
}
