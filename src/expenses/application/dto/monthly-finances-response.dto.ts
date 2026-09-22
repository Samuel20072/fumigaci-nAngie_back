import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory } from '../../domain/enums/expense-category.enum.js';

export class CategoryExpenseBreakdownDto {
  @ApiProperty({ enum: ExpenseCategory })
  category: ExpenseCategory;

  @ApiProperty()
  total: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  percentage: number;
}

export class MonthlyFinancesResponseDto {
  @ApiProperty({ example: '2026-09' })
  month: string;

  @ApiProperty({ description: 'Total de ingresos por servicios cobrados' })
  totalIncome: number;

  @ApiProperty({ description: 'Cantidad de servicios realizados en el mes' })
  completedServicesCount: number;

  @ApiProperty({ description: 'Total de gastos en el mes' })
  totalExpenses: number;

  @ApiProperty({ description: 'Cantidad de gastos registrados' })
  expensesCount: number;

  @ApiProperty({ description: 'Ganancia neta (Ingresos - Gastos)' })
  netProfit: number;

  @ApiProperty({ description: 'Total de gastos fijos/recurrentes' })
  recurringExpensesTotal: number;

  @ApiProperty({ type: [CategoryExpenseBreakdownDto] })
  categoryBreakdown: CategoryExpenseBreakdownDto[];
}
