import { ServiceType } from '../enums/service-type.enum.js';
import { ServiceStatus } from '../enums/service-status.enum.js';

/**
 * Entidad de dominio Service — sin decoradores de TypeORM.
 */
export class Service {
  id: string;
  customerId: string;
  type: ServiceType;
  status: ServiceStatus;
  serviceDate: Date;
  expirationDate?: Date;
  price?: number;
  paymentMethod?: string;
  notes?: string;
  parentServiceId?: string; // Repaso → Fumigación padre
  createdAt: Date;
  updatedAt: Date;
}
