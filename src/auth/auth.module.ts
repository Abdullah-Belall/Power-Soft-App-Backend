import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomersModule } from 'src/customers/customers.module';
import { SupportersModule } from 'src/supporters/supporters.module';
import { ManagersModule } from 'src/managers/managers.module';

@Module({
  imports: [CustomersModule, SupportersModule, ManagersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
