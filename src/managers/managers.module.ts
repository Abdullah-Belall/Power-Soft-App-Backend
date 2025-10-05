import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerEntity } from './entities/manager.entity';
import { ManagersDBService } from './DB_Services/managers_DB.service';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerEntity])],
  providers: [ManagersDBService],
  exports: [ManagersDBService],
})
export class ManagersModule {}
