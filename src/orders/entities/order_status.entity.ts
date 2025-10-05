import { CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatusEnum } from '../enums/order_enums';
import { OrderEntity } from './order.entity';

@Entity({ name: 'orders_status' })
export class OrderStatusEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => OrderEntity, (order) => order.status)
  order: OrderEntity;
  @Column({ type: 'enum', enum: OrderStatusEnum })
  status: OrderStatusEnum;
  @Column({ nullable: true })
  note: string;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
