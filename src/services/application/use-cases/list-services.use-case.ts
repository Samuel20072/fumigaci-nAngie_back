import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface.js';
import { ServiceResponseDto } from '../dto/service-response.dto.js';
import { ExpirationService } from '../services/expiration.service.js';

@Injectable()
export class ListServicesUseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository,
    private readonly expirationService: ExpirationService,
  ) {}

  async execute(): Promise<ServiceResponseDto[]> {
    const services = await this.serviceRepository.findAll();
    return services.map((s) => {
      const status = this.expirationService.getStatus(s.expirationDate);
      const days = this.expirationService.getDaysRemaining(s.expirationDate);
      return ServiceResponseDto.fromEntity(s, status, days);
    });
  }
}
