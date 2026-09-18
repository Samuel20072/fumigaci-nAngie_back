import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface.js';
import { ServiceResponseDto } from '../dto/service-response.dto.js';
import { ExpirationService } from '../services/expiration.service.js';

@Injectable()
export class GetServicesByCustomerUseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository,
    private readonly expirationService: ExpirationService,
  ) {}

  async execute(customerId: string): Promise<ServiceResponseDto[]> {
    const services = await this.serviceRepository.findByCustomerId(customerId);
    return services.map((s) => {
      const status = this.expirationService.getStatus(s.expirationDate);
      const days = this.expirationService.getDaysRemaining(s.expirationDate);
      return ServiceResponseDto.fromEntity(s, status, days);
    });
  }
}
