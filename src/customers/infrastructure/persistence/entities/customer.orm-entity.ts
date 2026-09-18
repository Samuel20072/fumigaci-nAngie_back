import { Entity, Column, OneToMany } from 'typeorm';
import { BaseOrmEntity } from '../../../../shared/infrastructure/database/base.orm-entity.js';

@Entity('customers')
export class CustomerOrmEntity extends BaseOrmEntity {
  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Column({ length: 30 })
  phone: string;

  @Column({ length: 250 })
  address: string;

  @Column({ length: 100, nullable: true })
  neighborhood: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
