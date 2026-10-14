import { Injectable, NotFoundException } from '@nestjs/common';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface.js';

@Injectable()
export class DeleteServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.serviceRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    await this.serviceRepository.delete(id);
  }
}
