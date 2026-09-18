import { Injectable, NotFoundException } from '@nestjs/common';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface.js';

@Injectable()
export class DeactivateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.customerRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`No se encontró ningún cliente con el ID proporcionado`);
    }
    await this.customerRepository.deactivate(id);
  }
}
