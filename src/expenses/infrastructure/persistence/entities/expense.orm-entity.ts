import { Entity, Column } from 'typeorm';
import { BaseOrmEntity } from '../../../../shared/infrastructure/database/base.orm-entity.js';
import { ExpenseCategory } from '../../../domain/enums/expense-category.enum.js';

@Entity('expenses')
export class ExpenseOrmEntity extends BaseOrmEntity {
  @Column({ length: 200 })
  concept: string;

  @Column({
    type: 'enum',
    enum: ExpenseCategory,
    default: ExpenseCategory.OTROS,
  })
  category: ExpenseCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ name: 'expense_date', type: 'date' })
  expenseDate: Date;

  @Column({ name: 'is_recurring', type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string | null;
}
