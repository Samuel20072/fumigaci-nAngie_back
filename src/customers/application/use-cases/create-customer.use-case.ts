import { Injectable, ConflictException } from '@nestjs/common';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface.js';
import { CreateCustomerDto } from '../dto/create-customer.dto.js';
import { CustomerResponseDto } from '../dto/customer-response.dto.js';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    // Verificar si ya existe un cliente con ese teléfono
    const existing = await this.customerRepository.findByPhone(dto.phone);
    if (existing) {
      throw new ConflictException({
        message: `Ya existe un cliente registrado con el teléfono ${dto.phone}`,
        existingCustomerId: existing.id,
        existingCustomerName: existing.fullName,
      });
    }

    const customer = await this.customerRepository.create({
      fullName: dto.fullName,
      phone: dto.phone,
      address: dto.address,
      neighborhood: dto.neighborhood,
      city: dto.city,
      notes: dto.notes,
      isActive: dto.isActive ?? true,
    });

    return CustomerResponseDto.fromEntity(customer);
  }
}
