import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateExpenseUseCase } from '../application/use-cases/create-expense.use-case.js';
import { ListExpensesUseCase } from '../application/use-cases/list-expenses.use-case.js';
import { UpdateExpenseUseCase } from '../application/use-cases/update-expense.use-case.js';
import { DeleteExpenseUseCase } from '../application/use-cases/delete-expense.use-case.js';
import { CreateExpenseDto } from '../application/dto/create-expense.dto.js';
import { UpdateExpenseDto } from '../application/dto/update-expense.dto.js';
import { ExpenseResponseDto } from '../application/dto/expense-response.dto.js';
import { ExpenseCategory } from '../domain/enums/expense-category.enum.js';

@ApiTags('expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly createExpense: CreateExpenseUseCase,
    private readonly listExpenses: ListExpensesUseCase,
    private readonly updateExpense: UpdateExpenseUseCase,
    private readonly deleteExpense: DeleteExpenseUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nuevo gasto' })
  @ApiResponse({ status: 201, type: ExpenseResponseDto })
  create(@Body() dto: CreateExpenseDto) {
    return this.createExpense.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar gastos filtrados por mes o categoría' })
  @ApiQuery({ name: 'month', required: false, description: 'Mes en formato YYYY-MM' })
  @ApiQuery({ name: 'category', required: false, enum: ExpenseCategory })
  @ApiResponse({ status: 200, type: [ExpenseResponseDto] })
  findAll(
    @Query('month') month?: string,
    @Query('category') category?: ExpenseCategory,
  ) {
    return this.listExpenses.execute(month, category);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un gasto' })
  @ApiResponse({ status: 200, type: ExpenseResponseDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.updateExpense.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un gasto' })
  @ApiResponse({ status: 204, description: 'Gasto eliminado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteExpense.execute(id);
  }
}
