import { Injectable, NotFoundException } from '@nestjs/common';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface.js';
import { UpdateCustomerDto } from '../dto/update-customer.dto.js';
import { CustomerResponseDto } from '../dto/customer-response.dto.js';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string, dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    const exists = await this.customerRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`No se encontró ningún cliente con el ID proporcionado`);
    }
    const updated = await this.customerRepository.update(id, dto);
    return CustomerResponseDto.fromEntity(updated);
  }
}
