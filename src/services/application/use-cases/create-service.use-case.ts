import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface.js';
import { ICustomerRepository } from '../../../customers/domain/repositories/customer.repository.interface.js';
import { CreateServiceDto } from '../dto/create-service.dto.js';
import { ServiceResponseDto } from '../dto/service-response.dto.js';
import { ExpirationService } from '../services/expiration.service.js';
import { ServiceType } from '../../domain/enums/service-type.enum.js';

@Injectable()
export class CreateServiceUseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository,
    private readonly customerRepository: ICustomerRepository,
    private readonly expirationService: ExpirationService,
  ) {}

  async execute(dto: CreateServiceDto): Promise<ServiceResponseDto> {
    // Verificar que el cliente existe
    const customerExists = await this.customerRepository.exists(dto.customerId);
    if (!customerExists) {
      throw new NotFoundException(`No se encontró ningún cliente con el ID proporcionado`);
    }

    // Si es un repaso, verificar que el servicio padre existe y es fumigación
    if (dto.parentServiceId) {
      if (dto.type !== ServiceType.REPASO) {
        throw new BadRequestException('Solo los servicios de tipo REPASO pueden tener un servicio padre');
      }
      const parent = await this.serviceRepository.findById(dto.parentServiceId);
      if (!parent) {
        throw new NotFoundException(`No se encontró el servicio de fumigación relacionado`);
      }
      if (parent.type !== ServiceType.FUMIGACION) {
        throw new BadRequestException('El servicio padre debe ser de tipo FUMIGACION');
      }
    }

    // Calcular fecha de vencimiento
    let expirationDate: Date | undefined;
    if (dto.expirationDate) {
      expirationDate = new Date(dto.expirationDate);
    } else if (dto.durationDays) {
      expirationDate = this.expirationService.calculateExpirationDate(
        new Date(dto.serviceDate),
        dto.durationDays,
      );
    }

    const service = await this.serviceRepository.create({
      customerId: dto.customerId,
      type: dto.type,
      status: dto.status,
      serviceDate: new Date(dto.serviceDate),
      expirationDate,
      price: dto.price,
      paymentMethod: dto.paymentMethod,
      notes: dto.notes,
      parentServiceId: dto.parentServiceId,
    });

    const status = this.expirationService.getStatus(service.expirationDate);
    const days = this.expirationService.getDaysRemaining(service.expirationDate);
    return ServiceResponseDto.fromEntity(service, status, days);
  }
}
