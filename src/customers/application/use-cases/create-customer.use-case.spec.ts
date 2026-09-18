import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConflictException } from '@nestjs/common';
import { CreateCustomerUseCase } from './create-customer.use-case.js';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface.js';
import type { Customer } from '../../domain/entities/customer.entity.js';

const mockCustomer: Customer = {
  id: 'uuid-test',
  fullName: 'María García',
  phone: '3001234567',
  address: 'Calle 45 # 23-10',
  neighborhood: 'El Poblado',
  city: 'Medellín',
  notes: undefined,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let repo: ICustomerRepository;

  beforeEach(() => {
    repo = {
      create: vi.fn().mockResolvedValue(mockCustomer),
      findById: vi.fn(),
      findByPhone: vi.fn().mockResolvedValue(null),
      findAll: vi.fn(),
      search: vi.fn(),
      update: vi.fn(),
      deactivate: vi.fn(),
      exists: vi.fn(),
    } as unknown as ICustomerRepository;

    useCase = new CreateCustomerUseCase(repo);
  });

  it('debe crear un cliente correctamente', async () => {
    const result = await useCase.execute({
      fullName: 'María García',
      phone: '3001234567',
      address: 'Calle 45 # 23-10',
    });

    expect(result.fullName).toBe('María García');
    expect(result.phone).toBe('3001234567');
    expect(repo.create).toHaveBeenCalledOnce();
  });

  it('debe lanzar ConflictException si el teléfono ya existe', async () => {
    vi.mocked(repo.findByPhone).mockResolvedValue(mockCustomer);

    await expect(
      useCase.execute({
        fullName: 'Otro Cliente',
        phone: '3001234567',
        address: 'Otra dirección',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
