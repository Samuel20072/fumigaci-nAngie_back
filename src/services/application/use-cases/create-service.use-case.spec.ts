import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateServiceUseCase } from './create-service.use-case.js';
import { ServiceType } from '../../domain/enums/service-type.enum.js';
import { ServiceStatus } from '../../domain/enums/service-status.enum.js';
import { ExpirationService, ExpirationStatus } from '../services/expiration.service.js';
import type { IServiceRepository } from '../../domain/repositories/service.repository.interface.js';
import type { ICustomerRepository } from '../../../customers/domain/repositories/customer.repository.interface.js';
import type { Service } from '../../domain/entities/service.entity.js';

const mockService: Service = {
  id: 'service-uuid-1',
  customerId: 'cust-uuid-1',
  type: ServiceType.FUMIGACION,
  status: ServiceStatus.REALIZADO,
  serviceDate: new Date('2026-03-01'),
  expirationDate: new Date('2026-06-01'),
  price: 150000,
  paymentMethod: 'Efectivo',
  notes: 'Fumigación completa',
  parentServiceId: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreateServiceUseCase', () => {
  let useCase: CreateServiceUseCase;
  let serviceRepo: IServiceRepository;
  let customerRepo: ICustomerRepository;
  let expirationService: ExpirationService;

  beforeEach(() => {
    serviceRepo = {
      create: vi.fn().mockResolvedValue(mockService),
      findById: vi.fn(),
      findAll: vi.fn(),
      findByCustomerId: vi.fn(),
      findExpiring: vi.fn(),
      findExpired: vi.fn(),
      findRecent: vi.fn(),
      update: vi.fn(),
      cancel: vi.fn(),
      count: vi.fn(),
      countByStatus: vi.fn(),
    } as unknown as IServiceRepository;

    customerRepo = {
      exists: vi.fn().mockResolvedValue(true),
      create: vi.fn(),
      findById: vi.fn(),
      findByPhone: vi.fn(),
      findAll: vi.fn(),
      search: vi.fn(),
      update: vi.fn(),
      deactivate: vi.fn(),
    } as unknown as ICustomerRepository;

    expirationService = {
      getStatus: vi.fn().mockReturnValue(ExpirationStatus.ACTIVE),
      getDaysRemaining: vi.fn().mockReturnValue(90),
      calculateExpirationDate: vi.fn().mockReturnValue(new Date('2026-06-01')),
    } as unknown as ExpirationService;

    useCase = new CreateServiceUseCase(serviceRepo, customerRepo, expirationService);
  });

  it('debe crear un servicio de fumigación correctamente', async () => {
    const result = await useCase.execute({
      customerId: 'cust-uuid-1',
      type: ServiceType.FUMIGACION,
      status: ServiceStatus.REALIZADO,
      serviceDate: '2026-03-01',
      expirationDate: '2026-06-01',
      price: 150000,
    });

    expect(result.id).toBe('service-uuid-1');
    expect(result.customerId).toBe('cust-uuid-1');
    expect(serviceRepo.create).toHaveBeenCalledOnce();
  });

  it('debe lanzar NotFoundException si el cliente no existe', async () => {
    vi.mocked(customerRepo.exists).mockResolvedValue(false);

    await expect(
      useCase.execute({
        customerId: 'non-existent',
        type: ServiceType.FUMIGACION,
        status: ServiceStatus.REALIZADO,
        serviceDate: '2026-03-01',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('debe validar que solo un repaso puede tener parentServiceId', async () => {
    await expect(
      useCase.execute({
        customerId: 'cust-uuid-1',
        type: ServiceType.FUMIGACION,
        status: ServiceStatus.REALIZADO,
        serviceDate: '2026-03-01',
        parentServiceId: 'parent-123',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
