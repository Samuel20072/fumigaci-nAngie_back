import { Injectable } from '@nestjs/common';
import { IExtraIncomeRepository } from '../../domain/repositories/extra-income.repository.interface.js';

@Injectable()
export class DeleteExtraIncomeUseCase {
  constructor(private readonly extraIncomeRepository: IExtraIncomeRepository) {}

  async execute(id: string): Promise<void> {
    await this.extraIncomeRepository.delete(id);
  }
}
