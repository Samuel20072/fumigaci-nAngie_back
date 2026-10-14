import { ExtraIncomeCategory } from '../enums/extra-income-category.enum.js';

export interface ExtraIncome {
  id: string;
  concept: string;
  category: ExtraIncomeCategory;
  amount: number;
  incomeDate: Date;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
