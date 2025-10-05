import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatusEnum, PrivateStatusEnum } from '../enums/order_enums';
import { CustomerEntity } from 'src/customers/entities/customer.entity';
import { SupporterEntity } from 'src/supporters/entities/supporter.entity';
import { OrderStatusEntity } from './order_status.entity';
import { CustomerOrderNoteEntity } from './customer_order_note.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => CustomerEntity, (customer) => customer.orders)
  customer: CustomerEntity;
  @ManyToOne(() => SupporterEntity, (supporter) => supporter.orders)
  supporter: SupporterEntity;
  @OneToMany(() => OrderStatusEntity, (status) => status.order, {
    cascade: true,
  })
  status: OrderStatusEntity[];
  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  curr_status: OrderStatusEnum;
  @OneToMany(() => CustomerOrderNoteEntity, (note) => note.order, {
    cascade: true,
  })
  customer_order_notes: CustomerOrderNoteEntity[];
  @Column()
  company_name: string;
  @Column()
  company_phone: string;
  @Column()
  details: string;
  @Column({
    type: 'enum',
    enum: PrivateStatusEnum,
    default: PrivateStatusEnum.NORMAL,
  })
  private_status: PrivateStatusEnum;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
