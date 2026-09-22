import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';
import { ExpenseCategory } from '../../domain/enums/expense-category.enum.js';

export class CreateExpenseDto {
  @ApiProperty({ description: 'Descripción o concepto del gasto', example: 'Gasolina moto' })
  @IsString()
  @IsNotEmpty({ message: 'El concepto del gasto es obligatorio' })
  @MaxLength(200, { message: 'El concepto no puede superar 200 caracteres' })
  concept: string;

  @ApiProperty({ enum: ExpenseCategory, description: 'Categoría del gasto', example: ExpenseCategory.GASOLINA })
  @IsEnum(ExpenseCategory, { message: 'Categoría de gasto inválida' })
  category: ExpenseCategory;

  @ApiProperty({ description: 'Monto del gasto', example: 25000 })
  @IsNumber({}, { message: 'El monto debe ser un número válido' })
  @Min(0, { message: 'El monto no puede ser negativo' })
  amount: number;

  @ApiProperty({ description: 'Fecha del gasto (YYYY-MM-DD)', example: '2026-09-21' })
  @IsDateString({}, { message: 'La fecha del gasto no tiene un formato válido' })
  expenseDate: string;

  @ApiPropertyOptional({ description: 'Indica si es un gasto recurrente / fijo mensual', example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({ description: 'Notas adicionales del gasto' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
