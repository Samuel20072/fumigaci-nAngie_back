import { Injectable } from '@nestjs/common';
import { IExpenseRepository } from '../../domain/repositories/expense.repository.interface.js';
import { IServiceRepository } from '../../../services/domain/repositories/service.repository.interface.js';
import { ServiceStatus } from '../../../services/domain/enums/service-status.enum.js';
import { ExpenseCategory } from '../../domain/enums/expense-category.enum.js';
import {
  MonthlyFinancesResponseDto,
  CategoryExpenseBreakdownDto,
} from '../dto/monthly-finances-response.dto.js';

@Injectable()
export class GetMonthlyFinancesUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(month?: string): Promise<MonthlyFinancesResponseDto> {
    const targetMonth = month || new Date().toISOString().slice(0, 7); // 'YYYY-MM'

    // 1. Obtener todos los servicios realizados en el mes
    const allServices = await this.serviceRepository.findAll();
    const monthlyServices = allServices.filter((s) => {
      if (s.status !== ServiceStatus.REALIZADO) return false;
      const sDateStr = s.serviceDate instanceof Date 
        ? s.serviceDate.toISOString().slice(0, 7) 
        : String(s.serviceDate).slice(0, 7);
      return sDateStr === targetMonth;
    });

    const totalIncome = monthlyServices.reduce(
      (sum, s) => sum + (Number(s.price) || 0),
      0,
    );
    const completedServicesCount = monthlyServices.length;

    // 2. Obtener los gastos del mes
    const monthlyExpenses = await this.expenseRepository.findAll(targetMonth);
    const totalExpenses = monthlyExpenses.reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0,
    );
    const expensesCount = monthlyExpenses.length;
    const recurringExpensesTotal = monthlyExpenses
      .filter((e) => e.isRecurring)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const netProfit = totalIncome - totalExpenses;

    // 3. Desglose por categoría de gasto
    const categoryBreakdown: CategoryExpenseBreakdownDto[] = Object.values(
      ExpenseCategory,
    ).map((cat) => {
      const catExpenses = monthlyExpenses.filter((e) => e.category === cat);
      const catTotal = catExpenses.reduce(
        (sum, e) => sum + (Number(e.amount) || 0),
        0,
      );
      const percentage =
        totalExpenses > 0 ? Math.round((catTotal / totalExpenses) * 100) : 0;

      return {
        category: cat,
        total: catTotal,
        count: catExpenses.length,
        percentage,
      };
    });

    // Ordenar categorías por mayor gasto
    categoryBreakdown.sort((a, b) => b.total - a.total);

    return {
      month: targetMonth,
      totalIncome,
      completedServicesCount,
      totalExpenses,
      expensesCount,
      netProfit,
      recurringExpensesTotal,
      categoryBreakdown,
    };
  }
}
