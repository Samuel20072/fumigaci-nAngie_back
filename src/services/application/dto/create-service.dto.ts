import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsOptional,
  IsNumber,
  IsString,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ServiceType } from '../../domain/enums/service-type.enum.js';
import { ServiceStatus } from '../../domain/enums/service-status.enum.js';

export class CreateServiceDto {
  @ApiProperty({ description: 'ID del cliente', example: 'uuid-del-cliente' })
  @IsUUID()
  @IsNotEmpty({ message: 'El cliente es obligatorio' })
  customerId: string;

  @ApiProperty({ enum: ServiceType, description: 'Tipo de servicio', example: ServiceType.FUMIGACION })
  @IsEnum(ServiceType, { message: 'El tipo debe ser FUMIGACION o REPASO' })
  type: ServiceType;

  @ApiProperty({ enum: ServiceStatus, description: 'Estado del servicio', example: ServiceStatus.REALIZADO })
  @IsEnum(ServiceStatus)
  status: ServiceStatus;

  @ApiProperty({ description: 'Fecha del servicio', example: '2026-09-15' })
  @IsDateString({}, { message: 'La fecha del servicio no tiene un formato válido' })
  serviceDate: string;

  @ApiPropertyOptional({ description: 'Fecha de vencimiento del servicio', example: '2026-10-15' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de vencimiento no tiene un formato válido' })
  expirationDate?: string;

  @ApiPropertyOptional({ description: 'Días de vigencia (alternativa a expirationDate)', example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  durationDays?: number;

  @ApiPropertyOptional({ description: 'Valor del servicio', example: 80000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Método de pago', example: 'Efectivo' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Notas del servicio' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ description: 'ID del servicio de fumigación padre (solo para REPASO)' })
  @IsOptional()
  @IsUUID()
  parentServiceId?: string;
}
