import { Module } from '@nestjs/common';
import { SupportersService } from './supporters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupporterEntity } from './entities/supporter.entity';
import { SupportersDBService } from './DB_Services/supporters_DB.service';

@Module({
  imports: [TypeOrmModule.forFeature([SupporterEntity])],
  providers: [SupportersService, SupportersDBService],
  exports: [SupportersService, SupportersDBService],
})
export class SupportersModule {}
