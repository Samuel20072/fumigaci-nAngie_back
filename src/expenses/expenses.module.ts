import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseOrmEntity } from './infrastructure/persistence/entities/expense.orm-entity.js';
import { ExpenseRepository } from './infrastructure/persistence/repositories/expense.repository.js';
import { IExpenseRepository } from './domain/repositories/expense.repository.interface.js';
import { CreateExpenseUseCase } from './application/use-cases/create-expense.use-case.js';
import { ListExpensesUseCase } from './application/use-cases/list-expenses.use-case.js';
import { UpdateExpenseUseCase } from './application/use-cases/update-expense.use-case.js';
import { DeleteExpenseUseCase } from './application/use-cases/delete-expense.use-case.js';
import { GetMonthlyFinancesUseCase } from './application/use-cases/get-monthly-finances.use-case.js';
import { ExpensesController } from './presentation/expenses.controller.js';
import { FinancesController } from './presentation/finances.controller.js';
import { ServicesModule } from '../services/services.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseOrmEntity]),
    ServicesModule,
  ],
  controllers: [ExpensesController, FinancesController],
  providers: [
    { provide: IExpenseRepository, useClass: ExpenseRepository },
    CreateExpenseUseCase,
    ListExpensesUseCase,
    UpdateExpenseUseCase,
    DeleteExpenseUseCase,
    GetMonthlyFinancesUseCase,
  ],
  exports: [IExpenseRepository, GetMonthlyFinancesUseCase],
})
export class ExpensesModule {}
