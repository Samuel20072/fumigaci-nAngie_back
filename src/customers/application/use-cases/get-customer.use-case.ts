import { Injectable, NotFoundException } from '@nestjs/common';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface.js';
import { CustomerResponseDto } from '../dto/customer-response.dto.js';

@Injectable()
export class GetCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`No se encontró ningún cliente con el ID proporcionado`);
    }
    return CustomerResponseDto.fromEntity(customer);
  }
}
