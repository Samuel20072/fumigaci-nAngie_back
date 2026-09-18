/**
 * Módulo: Customers — Dominio
 *
 * Entidad de dominio pura: sin decoradores de TypeORM.
 * Representa la realidad del negocio.
 */
export class Customer {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  neighborhood?: string;
  city?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
