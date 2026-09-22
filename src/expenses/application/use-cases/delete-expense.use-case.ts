import { Injectable } from '@nestjs/common';
import { IExpenseRepository } from '../../domain/repositories/expense.repository.interface.js';

@Injectable()
export class DeleteExpenseUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(id: string): Promise<void> {
    await this.expenseRepository.delete(id);
  }
}
