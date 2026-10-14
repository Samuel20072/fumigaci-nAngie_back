import { Injectable } from '@nestjs/common';
import { IExtraIncomeRepository } from '../../domain/repositories/extra-income.repository.interface.js';
import { ExtraIncomeResponseDto } from '../dto/extra-income-response.dto.js';
import { ExtraIncomeCategory } from '../../domain/enums/extra-income-category.enum.js';

@Injectable()
export class ListExtraIncomesUseCase {
  constructor(private readonly extraIncomeRepository: IExtraIncomeRepository) {}

  async execute(month?: string, category?: ExtraIncomeCategory): Promise<ExtraIncomeResponseDto[]> {
    const incomes = await this.extraIncomeRepository.findAll(month, category);
    return incomes.map((i) => ExtraIncomeResponseDto.fromEntity(i));
  }
}
