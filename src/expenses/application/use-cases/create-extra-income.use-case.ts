import { Injectable } from '@nestjs/common';
import { IExtraIncomeRepository } from '../../domain/repositories/extra-income.repository.interface.js';
import { CreateExtraIncomeDto } from '../dto/create-extra-income.dto.js';
import { ExtraIncomeResponseDto } from '../dto/extra-income-response.dto.js';

@Injectable()
export class CreateExtraIncomeUseCase {
  constructor(private readonly extraIncomeRepository: IExtraIncomeRepository) {}

  async execute(dto: CreateExtraIncomeDto): Promise<ExtraIncomeResponseDto> {
    const income = await this.extraIncomeRepository.create({
      concept: dto.concept,
      category: dto.category,
      amount: dto.amount,
      incomeDate: new Date(dto.incomeDate),
      notes: dto.notes ?? null,
    });

    return ExtraIncomeResponseDto.fromEntity(income);
  }
}
