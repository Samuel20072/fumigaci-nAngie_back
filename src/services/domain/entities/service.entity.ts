import { ServiceType } from '../enums/service-type.enum.js';
import { ServiceStatus } from '../enums/service-status.enum.js';
import { Customer } from '../../../customers/domain/entities/customer.entity.js';

/**
 * Entidad de dominio Service — sin decoradores de TypeORM.
 */
export class Service {
  id: string;
  customerId: string;
  customer?: Customer;
  type: ServiceType;
  status: ServiceStatus;
  serviceDate: Date;
  expirationDate?: Date;
  price?: number;
  paymentMethod?: string;
  notes?: string;
  serviceTime?: string;
  parentServiceId?: string; // Repaso → Fumigación padre
  createdAt: Date;
  updatedAt: Date;
}
