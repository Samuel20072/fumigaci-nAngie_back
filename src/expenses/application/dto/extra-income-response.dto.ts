import { ApiProperty } from '@nestjs/swagger';
import { ExtraIncomeCategory } from '../../domain/enums/extra-income-category.enum.js';
import { ExtraIncome } from '../../domain/entities/extra-income.entity.js';

export class ExtraIncomeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  concept: string;

  @ApiProperty({ enum: ExtraIncomeCategory })
  category: ExtraIncomeCategory;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  incomeDate: string;

  @ApiProperty({ required: false, nullable: true })
  notes: string | null;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(e: ExtraIncome): ExtraIncomeResponseDto {
    const dto = new ExtraIncomeResponseDto();
    dto.id = e.id;
    dto.concept = e.concept;
    dto.category = e.category;
    dto.amount = Number(e.amount);
    dto.incomeDate = e.incomeDate instanceof Date
      ? e.incomeDate.toISOString().split('T')[0]
      : String(e.incomeDate);
    dto.notes = e.notes ?? null;
    dto.createdAt = e.createdAt;
    return dto;
  }
}
