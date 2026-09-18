import { Service } from '../entities/service.entity.js';
import { ServiceType } from '../enums/service-type.enum.js';

export abstract class IServiceRepository {
  abstract create(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service>;
  abstract findById(id: string): Promise<Service | null>;
  abstract findAll(): Promise<Service[]>;
  abstract findByCustomerId(customerId: string): Promise<Service[]>;
  abstract findExpiring(daysAhead: number): Promise<Service[]>;
  abstract findExpired(): Promise<Service[]>;
  abstract findByType(type: ServiceType): Promise<Service[]>;
  abstract findFumigacionesByCustomer(customerId: string): Promise<Service[]>;
  abstract update(id: string, data: Partial<Service>): Promise<Service>;
  abstract exists(id: string): Promise<boolean>;
  abstract countByType(): Promise<{ fumigacion: number; repaso: number }>;
  abstract countTotal(): Promise<number>;
}
