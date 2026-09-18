import { Injectable, NotFoundException } from '@nestjs/common';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface.js';
import { ServiceResponseDto } from '../dto/service-response.dto.js';
import { ExpirationService } from '../services/expiration.service.js';

@Injectable()
export class GetServiceUseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository,
    private readonly expirationService: ExpirationService,
  ) {}

  async execute(id: string): Promise<ServiceResponseDto> {
    const service = await this.serviceRepository.findById(id);
    if (!service) throw new NotFoundException('Servicio no encontrado');
    const status = this.expirationService.getStatus(service.expirationDate);
    const days = this.expirationService.getDaysRemaining(service.expirationDate);
    return ServiceResponseDto.fromEntity(service, status, days);
  }
}
