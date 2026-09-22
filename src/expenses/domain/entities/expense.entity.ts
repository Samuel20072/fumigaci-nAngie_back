import { ExpenseCategory } from '../enums/expense-category.enum.js';

export interface Expense {
  id: string;
  concept: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: Date;
  isRecurring: boolean;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
