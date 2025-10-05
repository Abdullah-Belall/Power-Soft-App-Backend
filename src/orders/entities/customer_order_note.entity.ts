import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity({ name: 'customer_order_notes' })
export class CustomerOrderNoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => OrderEntity, (order) => order.customer_order_notes)
  order: OrderEntity;
  @Column()
  note: string;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
