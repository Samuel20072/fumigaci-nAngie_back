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
import { CreateExtraIncomeUseCase } from '../application/use-cases/create-extra-income.use-case.js';
import { ListExtraIncomesUseCase } from '../application/use-cases/list-extra-incomes.use-case.js';
import { UpdateExtraIncomeUseCase } from '../application/use-cases/update-extra-income.use-case.js';
import { DeleteExtraIncomeUseCase } from '../application/use-cases/delete-extra-income.use-case.js';
import { CreateExtraIncomeDto } from '../application/dto/create-extra-income.dto.js';
import { UpdateExtraIncomeDto } from '../application/dto/update-extra-income.dto.js';
import { ExtraIncomeResponseDto } from '../application/dto/extra-income-response.dto.js';
import { ExtraIncomeCategory } from '../domain/enums/extra-income-category.enum.js';

@ApiTags('extra-incomes')
@Controller('extra-incomes')
export class ExtraIncomesController {
  constructor(
    private readonly createExtraIncome: CreateExtraIncomeUseCase,
    private readonly listExtraIncomes: ListExtraIncomesUseCase,
    private readonly updateExtraIncome: UpdateExtraIncomeUseCase,
    private readonly deleteExtraIncome: DeleteExtraIncomeUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nuevo ingreso extra' })
  @ApiResponse({ status: 201, type: ExtraIncomeResponseDto })
  create(@Body() dto: CreateExtraIncomeDto) {
    return this.createExtraIncome.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ingresos extras filtrados por mes o categoría' })
  @ApiQuery({ name: 'month', required: false, description: 'Mes en formato YYYY-MM' })
  @ApiQuery({ name: 'category', required: false, enum: ExtraIncomeCategory })
  @ApiResponse({ status: 200, type: [ExtraIncomeResponseDto] })
  findAll(
    @Query('month') month?: string,
    @Query('category') category?: ExtraIncomeCategory,
  ) {
    return this.listExtraIncomes.execute(month, category);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ingreso extra' })
  @ApiResponse({ status: 200, type: ExtraIncomeResponseDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExtraIncomeDto,
  ) {
    return this.updateExtraIncome.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un ingreso extra' })
  @ApiResponse({ status: 204, description: 'Ingreso extra eliminado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteExtraIncome.execute(id);
  }
}
