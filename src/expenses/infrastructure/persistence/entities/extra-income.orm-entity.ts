import { Entity, Column } from 'typeorm';
import { BaseOrmEntity } from '../../../../shared/infrastructure/database/base.orm-entity.js';
import { ExtraIncomeCategory } from '../../../domain/enums/extra-income-category.enum.js';

@Entity('extra_incomes')
export class ExtraIncomeOrmEntity extends BaseOrmEntity {
  @Column({ length: 200 })
  concept: string;

  @Column({
    type: 'enum',
    enum: ExtraIncomeCategory,
    default: ExtraIncomeCategory.OTROS,
  })
  category: ExtraIncomeCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ name: 'income_date', type: 'date' })
  incomeDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;
}
