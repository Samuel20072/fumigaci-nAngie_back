import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseOrmEntity } from '../../../../shared/infrastructure/database/base.orm-entity.js';
import { CustomerOrmEntity } from '../../../../customers/infrastructure/persistence/entities/customer.orm-entity.js';
import { ServiceType } from '../../../domain/enums/service-type.enum.js';
import { ServiceStatus } from '../../../domain/enums/service-status.enum.js';

@Entity('services')
export class ServiceOrmEntity extends BaseOrmEntity {
  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => CustomerOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerOrmEntity;

  @Column({ type: 'enum', enum: ServiceType })
  type: ServiceType;

  @Column({ type: 'enum', enum: ServiceStatus, default: ServiceStatus.REALIZADO })
  status: ServiceStatus;

  @Column({ name: 'service_date', type: 'date' })
  serviceDate: Date;

  @Column({ name: 'expiration_date', type: 'date', nullable: true })
  expirationDate: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: number;

  @Column({ name: 'payment_method', length: 50, nullable: true })
  paymentMethod: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'parent_service_id', nullable: true })
  parentServiceId: string;

  @ManyToOne(() => ServiceOrmEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_service_id' })
  parentService: ServiceOrmEntity;
}
