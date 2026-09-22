import { Injectable } from '@nestjs/common';
import { IExpenseRepository } from '../../domain/repositories/expense.repository.interface.js';
import { ExpenseResponseDto } from '../dto/expense-response.dto.js';
import { ExpenseCategory } from '../../domain/enums/expense-category.enum.js';

@Injectable()
export class ListExpensesUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(month?: string, category?: ExpenseCategory): Promise<ExpenseResponseDto[]> {
    const expenses = await this.expenseRepository.findAll(month, category);
    return expenses.map((e) => ExpenseResponseDto.fromEntity(e));
  }
}
