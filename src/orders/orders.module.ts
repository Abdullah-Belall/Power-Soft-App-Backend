import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderEntity } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatusEntity } from './entities/order_status.entity';
import { CustomerOrderNoteEntity } from './entities/customer_order_note.entity';
import { OrdersDBService } from './DB_Services/orders_DB.service';
import { CustomersModule } from 'src/customers/customers.module';
import { SupportersModule } from 'src/supporters/supporters.module';
import { StatusDBService } from './DB_Services/status_DB.service';
import { CustomerOrderNotesDBService } from './DB_Services/customer_order_notes_DB.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderStatusEntity,
      CustomerOrderNoteEntity,
    ]),
    CustomersModule,
    SupportersModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersDBService,
    StatusDBService,
    CustomerOrderNotesDBService,
  ],
})
export class OrdersModule {}
