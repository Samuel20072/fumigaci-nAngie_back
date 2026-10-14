import { ExtraIncome } from '../entities/extra-income.entity.js';
import { ExtraIncomeCategory } from '../enums/extra-income-category.enum.js';

export abstract class IExtraIncomeRepository {
  abstract create(data: Omit<ExtraIncome, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExtraIncome>;
  abstract findById(id: string): Promise<ExtraIncome | null>;
  abstract findAll(month?: string, category?: ExtraIncomeCategory): Promise<ExtraIncome[]>;
  abstract update(id: string, data: Partial<ExtraIncome>): Promise<ExtraIncome>;
  abstract delete(id: string): Promise<void>;
  abstract exists(id: string): Promise<boolean>;
}
