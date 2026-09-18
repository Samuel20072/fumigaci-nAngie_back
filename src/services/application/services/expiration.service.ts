import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum ExpirationStatus {
  ACTIVE = 'ACTIVE',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED',
  NO_DATE = 'NO_DATE',
}

/**
 * Servicio de dominio centralizado para calcular vigencias.
 * TODA la lógica de vigencia vive aquí — no en componentes ni controllers.
 */
@Injectable()
export class ExpirationService {
  private readonly alertDays: number;

  constructor(private readonly config: ConfigService) {
    this.alertDays = this.config.get<number>('EXPIRATION_ALERT_DAYS', 7);
  }

  getStatus(expirationDate?: Date | null): ExpirationStatus {
    if (!expirationDate) return ExpirationStatus.NO_DATE;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const exp = new Date(expirationDate);
    exp.setHours(0, 0, 0, 0);

    const diffMs = exp.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return ExpirationStatus.EXPIRED;
    if (diffDays <= this.alertDays) return ExpirationStatus.EXPIRING_SOON;
    return ExpirationStatus.ACTIVE;
  }

  getDaysRemaining(expirationDate?: Date | null): number | null {
    if (!expirationDate) return null;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const exp = new Date(expirationDate);
    exp.setHours(0, 0, 0, 0);

    const diffMs = exp.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  calculateExpirationDate(serviceDate: Date, days: number): Date {
    const result = new Date(serviceDate);
    result.setDate(result.getDate() + days);
    return result;
  }
}
