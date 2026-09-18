import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Customer } from '../../domain/entities/customer.entity.js';

export class CustomerResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() fullName: string;
  @ApiProperty() phone: string;
  @ApiProperty() address: string;
  @ApiPropertyOptional() neighborhood?: string;
  @ApiPropertyOptional() city?: string;
  @ApiPropertyOptional() notes?: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  static fromEntity(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = customer.id;
    dto.fullName = customer.fullName;
    dto.phone = customer.phone;
    dto.address = customer.address;
    dto.neighborhood = customer.neighborhood;
    dto.city = customer.city;
    dto.notes = customer.notes;
    dto.isActive = customer.isActive;
    dto.createdAt = customer.createdAt;
    dto.updatedAt = customer.updatedAt;
    return dto;
  }
}
