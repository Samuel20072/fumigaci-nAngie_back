import { Expense } from '../entities/expense.entity.js';
import { ExpenseCategory } from '../enums/expense-category.enum.js';

export abstract class IExpenseRepository {
  abstract create(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense>;
  abstract findById(id: string): Promise<Expense | null>;
  abstract findAll(month?: string, category?: ExpenseCategory): Promise<Expense[]>;
  abstract findByDateRange(startDate: Date, endDate: Date): Promise<Expense[]>;
  abstract update(id: string, data: Partial<Expense>): Promise<Expense>;
  abstract delete(id: string): Promise<void>;
  abstract sumByDateRange(startDate: Date, endDate: Date): Promise<number>;
}
