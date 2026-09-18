import { Injectable } from '@nestjs/common';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface.js';
import { CustomerResponseDto } from '../dto/customer-response.dto.js';

@Injectable()
export class ListCustomersUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(isActive?: boolean): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.findAll({ isActive });
    return customers.map(CustomerResponseDto.fromEntity);
  }
}
