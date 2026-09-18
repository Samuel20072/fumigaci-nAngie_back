import { describe, it, expect } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { ExpirationService, ExpirationStatus } from './expiration.service.js';

describe('ExpirationService', () => {
  let service: ExpirationService;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      get: ((key: string, defaultValue: number) => defaultValue) as any,
    };
    service = new ExpirationService(mockConfigService as ConfigService);
  });

  it('debe retornar NO_DATE si no hay expirationDate', () => {
    expect(service.getStatus(null)).toBe(ExpirationStatus.NO_DATE);
    expect(service.getStatus(undefined)).toBe(ExpirationStatus.NO_DATE);
    expect(service.getDaysRemaining(null)).toBeNull();
  });

  it('debe retornar EXPIRED si la fecha ya pasó', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);
    expect(service.getStatus(pastDate)).toBe(ExpirationStatus.EXPIRED);
  });

  it('debe retornar EXPIRING_SOON si faltan 7 días o menos', () => {
    const soonDate = new Date();
    soonDate.setDate(soonDate.getDate() + 4);
    expect(service.getStatus(soonDate)).toBe(ExpirationStatus.EXPIRING_SOON);
  });

  it('debe retornar ACTIVE si faltan más de 7 días', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    expect(service.getStatus(futureDate)).toBe(ExpirationStatus.ACTIVE);
  });

  it('debe calcular fecha de vencimiento sumando días', () => {
    const serviceDate = new Date(2026, 0, 1);
    const expiration = service.calculateExpirationDate(serviceDate, 30);
    expect(expiration.getDate()).toBe(31);
  });
});
