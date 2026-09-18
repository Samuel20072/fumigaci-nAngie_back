import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface.js';
import { ServiceResponseDto } from '../dto/service-response.dto.js';
import { ExpirationService, ExpirationStatus } from '../services/expiration.service.js';

@Injectable()
export class GetExpiredServicesUseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository,
    private readonly expirationService: ExpirationService,
  ) {}

  async execute(): Promise<ServiceResponseDto[]> {
    const services = await this.serviceRepository.findExpired();
    return services.map((s) =>
      ServiceResponseDto.fromEntity(s, ExpirationStatus.EXPIRED, this.expirationService.getDaysRemaining(s.expirationDate)),
    );
  }
}
