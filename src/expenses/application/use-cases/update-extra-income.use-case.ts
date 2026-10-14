import { Injectable } from '@nestjs/common';
import { IExtraIncomeRepository } from '../../domain/repositories/extra-income.repository.interface.js';
import { UpdateExtraIncomeDto } from '../dto/update-extra-income.dto.js';
import { ExtraIncomeResponseDto } from '../dto/extra-income-response.dto.js';

@Injectable()
export class UpdateExtraIncomeUseCase {
  constructor(private readonly extraIncomeRepository: IExtraIncomeRepository) {}

  async execute(id: string, dto: UpdateExtraIncomeDto): Promise<ExtraIncomeResponseDto> {
    const dataToUpdate: any = { ...dto };
    if (dto.incomeDate) {
      dataToUpdate.incomeDate = new Date(dto.incomeDate);
    }
    const updated = await this.extraIncomeRepository.update(id, dataToUpdate);
    return ExtraIncomeResponseDto.fromEntity(updated);
  }
}
