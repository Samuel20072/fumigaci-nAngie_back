import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory } from '../../domain/enums/expense-category.enum.js';
import { Expense } from '../../domain/entities/expense.entity.js';

export class ExpenseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  concept: string;

  @ApiProperty({ enum: ExpenseCategory })
  category: ExpenseCategory;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  expenseDate: string;

  @ApiProperty()
  isRecurring: boolean;

  @ApiProperty({ required: false, nullable: true })
  notes: string | null;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(e: Expense): ExpenseResponseDto {
    const dto = new ExpenseResponseDto();
    dto.id = e.id;
    dto.concept = e.concept;
    dto.category = e.category;
    dto.amount = Number(e.amount);
    dto.expenseDate = e.expenseDate instanceof Date 
      ? e.expenseDate.toISOString().split('T')[0] 
      : String(e.expenseDate);
    dto.isRecurring = Boolean(e.isRecurring);
    dto.notes = e.notes ?? null;
    dto.createdAt = e.createdAt;
    return dto;
  }
}
