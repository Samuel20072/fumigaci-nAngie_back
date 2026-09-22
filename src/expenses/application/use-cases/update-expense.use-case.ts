import { Injectable } from '@nestjs/common';
import { IExpenseRepository } from '../../domain/repositories/expense.repository.interface.js';
import { UpdateExpenseDto } from '../dto/update-expense.dto.js';
import { ExpenseResponseDto } from '../dto/expense-response.dto.js';

@Injectable()
export class UpdateExpenseUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(id: string, dto: UpdateExpenseDto): Promise<ExpenseResponseDto> {
    const dataToUpdate: any = { ...dto };
    if (dto.expenseDate) {
      dataToUpdate.expenseDate = new Date(dto.expenseDate);
    }
    const updated = await this.expenseRepository.update(id, dataToUpdate);
    return ExpenseResponseDto.fromEntity(updated);
  }
}
