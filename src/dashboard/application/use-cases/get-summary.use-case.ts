import { Injectable } from '@nestjs/common';
import { ICustomerRepository } from '../../../customers/domain/repositories/customer.repository.interface.js';
import { IServiceRepository } from '../../../services/domain/repositories/service.repository.interface.js';
import { ConfigService } from '@nestjs/config';
import { DashboardSummaryDto } from '../dto/dashboard-summary.dto.js';

@Injectable()
export class GetSummaryUseCase {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly serviceRepo: IServiceRepository,
    private readonly config: ConfigService,
  ) {}

  async execute(): Promise<DashboardSummaryDto> {
    const [allCustomers, totalServices, byType, expiring, expired] = await Promise.all([
      this.customerRepo.findAll(),
      this.serviceRepo.countTotal(),
      this.serviceRepo.countByType(),
      this.serviceRepo.findExpiring(this.config.get<number>('EXPIRATION_ALERT_DAYS', 7)),
      this.serviceRepo.findExpired(),
    ]);

    return {
      totalCustomers: allCustomers.length,
      activeCustomers: allCustomers.filter((c) => c.isActive).length,
      inactiveCustomers: allCustomers.filter((c) => !c.isActive).length,
      totalServices,
      totalFumigaciones: byType.fumigacion,
      totalRepasos: byType.repaso,
      expiringSoon: expiring.length,
      expired: expired.length,
    };
  }
}
