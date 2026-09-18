import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface.js';
import { ServiceResponseDto } from '../dto/service-response.dto.js';
import { ExpirationService } from '../services/expiration.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetExpiringServicesUseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository,
    private readonly expirationService: ExpirationService,
    private readonly config: ConfigService,
  ) {}

  async execute(): Promise<ServiceResponseDto[]> {
    const days = this.config.get<number>('EXPIRATION_ALERT_DAYS', 7);
    const services = await this.serviceRepository.findExpiring(days);
    return services.map((s) => {
      const status = this.expirationService.getStatus(s.expirationDate);
      const daysRemaining = this.expirationService.getDaysRemaining(s.expirationDate);
      return ServiceResponseDto.fromEntity(s, status, daysRemaining);
    });
  }
}
