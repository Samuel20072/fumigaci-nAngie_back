import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseOrmEntity } from './infrastructure/persistence/entities/expense.orm-entity.js';
import { ExtraIncomeOrmEntity } from './infrastructure/persistence/entities/extra-income.orm-entity.js';
import { ExpenseRepository } from './infrastructure/persistence/repositories/expense.repository.js';
import { ExtraIncomeRepository } from './infrastructure/persistence/repositories/extra-income.repository.js';
import { IExpenseRepository } from './domain/repositories/expense.repository.interface.js';
import { IExtraIncomeRepository } from './domain/repositories/extra-income.repository.interface.js';
import { CreateExpenseUseCase } from './application/use-cases/create-expense.use-case.js';
import { ListExpensesUseCase } from './application/use-cases/list-expenses.use-case.js';
import { UpdateExpenseUseCase } from './application/use-cases/update-expense.use-case.js';
import { DeleteExpenseUseCase } from './application/use-cases/delete-expense.use-case.js';
import { CreateExtraIncomeUseCase } from './application/use-cases/create-extra-income.use-case.js';
import { ListExtraIncomesUseCase } from './application/use-cases/list-extra-incomes.use-case.js';
import { UpdateExtraIncomeUseCase } from './application/use-cases/update-extra-income.use-case.js';
import { DeleteExtraIncomeUseCase } from './application/use-cases/delete-extra-income.use-case.js';
import { GetMonthlyFinancesUseCase } from './application/use-cases/get-monthly-finances.use-case.js';
import { ExpensesController } from './presentation/expenses.controller.js';
import { ExtraIncomesController } from './presentation/extra-incomes.controller.js';
import { FinancesController } from './presentation/finances.controller.js';
import { ServicesModule } from '../services/services.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseOrmEntity, ExtraIncomeOrmEntity]),
    ServicesModule,
  ],
  controllers: [ExpensesController, ExtraIncomesController, FinancesController],
  providers: [
    { provide: IExpenseRepository, useClass: ExpenseRepository },
    { provide: IExtraIncomeRepository, useClass: ExtraIncomeRepository },
    CreateExpenseUseCase,
    ListExpensesUseCase,
    UpdateExpenseUseCase,
    DeleteExpenseUseCase,
    CreateExtraIncomeUseCase,
    ListExtraIncomesUseCase,
    UpdateExtraIncomeUseCase,
    DeleteExtraIncomeUseCase,
    GetMonthlyFinancesUseCase,
  ],
  exports: [IExpenseRepository, IExtraIncomeRepository, GetMonthlyFinancesUseCase],
})
export class ExpensesModule {}
