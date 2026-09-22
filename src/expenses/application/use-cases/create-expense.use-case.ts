import { Injectable } from '@nestjs/common';
import { IExpenseRepository } from '../../domain/repositories/expense.repository.interface.js';
import { CreateExpenseDto } from '../dto/create-expense.dto.js';
import { ExpenseResponseDto } from '../dto/expense-response.dto.js';

@Injectable()
export class CreateExpenseUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(dto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    const expense = await this.expenseRepository.create({
      concept: dto.concept,
      category: dto.category,
      amount: dto.amount,
      expenseDate: new Date(dto.expenseDate),
      isRecurring: dto.isRecurring ?? false,
      notes: dto.notes ?? null,
    });

    return ExpenseResponseDto.fromEntity(expense);
  }
}
