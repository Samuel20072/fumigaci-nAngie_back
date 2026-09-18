import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Service } from '../../domain/entities/service.entity.js';
import { ServiceType } from '../../domain/enums/service-type.enum.js';
import { ServiceStatus } from '../../domain/enums/service-status.enum.js';
import { ExpirationStatus } from '../services/expiration.service.js';

export class ServiceResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() customerId: string;
  @ApiProperty({ enum: ServiceType }) type: ServiceType;
  @ApiProperty({ enum: ServiceStatus }) status: ServiceStatus;
  @ApiProperty() serviceDate: Date;
  @ApiPropertyOptional() expirationDate?: Date;
  @ApiPropertyOptional() price?: number;
  @ApiPropertyOptional() paymentMethod?: string;
  @ApiPropertyOptional() notes?: string;
  @ApiPropertyOptional() parentServiceId?: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  // Campos calculados
  @ApiProperty({ enum: ExpirationStatus }) expirationStatus: ExpirationStatus;
  @ApiPropertyOptional() daysRemaining?: number | null;

  static fromEntity(service: Service, expirationStatus: ExpirationStatus, daysRemaining: number | null): ServiceResponseDto {
    const dto = new ServiceResponseDto();
    dto.id = service.id;
    dto.customerId = service.customerId;
    dto.type = service.type;
    dto.status = service.status;
    dto.serviceDate = service.serviceDate;
    dto.expirationDate = service.expirationDate;
    dto.price = service.price;
    dto.paymentMethod = service.paymentMethod;
    dto.notes = service.notes;
    dto.parentServiceId = service.parentServiceId;
    dto.createdAt = service.createdAt;
    dto.updatedAt = service.updatedAt;
    dto.expirationStatus = expirationStatus;
    dto.daysRemaining = daysRemaining;
    return dto;
  }
}
