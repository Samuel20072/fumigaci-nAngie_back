import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetMonthlyFinancesUseCase } from '../application/use-cases/get-monthly-finances.use-case.js';
import { MonthlyFinancesResponseDto } from '../application/dto/monthly-finances-response.dto.js';

@ApiTags('finances')
@Controller('finances')
export class FinancesController {
  constructor(
    private readonly getMonthlyFinances: GetMonthlyFinancesUseCase,
  ) {}

  @Get('monthly-summary')
  @ApiOperation({ summary: 'Resumen financiero mensual (ingresos, gastos y ganancia neta)' })
  @ApiQuery({ name: 'month', required: false, description: 'Mes en formato YYYY-MM (ej: 2026-09)' })
  @ApiResponse({ status: 200, type: MonthlyFinancesResponseDto })
  getMonthlySummary(@Query('month') month?: string) {
    return this.getMonthlyFinances.execute(month);
  }
}
