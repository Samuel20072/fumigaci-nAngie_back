import { Injectable, NotFoundException } from '@nestjs/common';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface.js';
import { ServiceResponseDto } from '../dto/service-response.dto.js';
import { ExpirationService } from '../services/expiration.service.js';
import { UpdateServiceDto } from '../dto/update-service.dto.js';

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository,
    private readonly expirationService: ExpirationService,
  ) {}

  async execute(id: string, dto: UpdateServiceDto): Promise<ServiceResponseDto> {
    const exists = await this.serviceRepository.exists(id);
    if (!exists) throw new NotFoundException('Servicio no encontrado');

    const updateData: Record<string, unknown> = { ...dto };

    if (dto.serviceDate && dto.durationDays && !dto.expirationDate) {
      updateData['expirationDate'] = this.expirationService.calculateExpirationDate(
        new Date(dto.serviceDate),
        dto.durationDays,
      );
    } else if (dto.expirationDate) {
      updateData['expirationDate'] = new Date(dto.expirationDate);
    }
    if (dto.serviceDate) updateData['serviceDate'] = new Date(dto.serviceDate);

    delete updateData['durationDays'];

    const updated = await this.serviceRepository.update(id, updateData as never);
    const status = this.expirationService.getStatus(updated.expirationDate);
    const days = this.expirationService.getDaysRemaining(updated.expirationDate);
    return ServiceResponseDto.fromEntity(updated, status, days);
  }
}
