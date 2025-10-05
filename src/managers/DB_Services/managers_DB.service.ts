import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerEntity } from '../entities/manager.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManagersDBService {
  constructor(
    @InjectRepository(ManagerEntity)
    private readonly managerRepo: Repository<ManagerEntity>,
  ) {}
  getManagersRepo() {
    return this.managerRepo;
  }
}
