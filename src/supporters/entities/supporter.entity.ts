import { OrderEntity } from 'src/orders/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'supporters' })
export class SupporterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToMany(() => OrderEntity, (order) => order.supporter, {
    cascade: true,
  })
  orders: OrderEntity[];
  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column({ unique: true })
  user_name: string;
  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true })
  phone: string;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
