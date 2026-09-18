import { Customer } from '../entities/customer.entity.js';

export interface CustomerFilters {
  search?: string;
  isActive?: boolean;
}

/**
 * Interfaz del repositorio de clientes.
 * La capa de dominio depende de esta interfaz, no de la implementación TypeORM.
 */
export abstract class ICustomerRepository {
  abstract create(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer>;
  abstract findById(id: string): Promise<Customer | null>;
  abstract findByPhone(phone: string): Promise<Customer | null>;
  abstract findAll(filters?: CustomerFilters): Promise<Customer[]>;
  abstract search(query: string): Promise<Customer[]>;
  abstract update(id: string, data: Partial<Customer>): Promise<Customer>;
  abstract deactivate(id: string): Promise<void>;
  abstract exists(id: string): Promise<boolean>;
}
