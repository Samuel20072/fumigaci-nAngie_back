import { Injectable } from '@nestjs/common';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface.js';
import { CustomerResponseDto } from '../dto/customer-response.dto.js';

@Injectable()
export class SearchCustomersUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(query: string): Promise<CustomerResponseDto[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }
    const customers = await this.customerRepository.search(query.trim());
    return customers.map(CustomerResponseDto.fromEntity);
  }
}
