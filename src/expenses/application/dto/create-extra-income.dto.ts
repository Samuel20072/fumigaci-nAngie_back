import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { ExtraIncomeCategory } from '../../domain/enums/extra-income-category.enum.js';

export class CreateExtraIncomeDto {
  @ApiProperty({ description: 'Concepto del ingreso extra', example: 'Venta de veneno para cucarachas' })
  @IsString()
  @IsNotEmpty({ message: 'El concepto del ingreso es obligatorio' })
  @MaxLength(200, { message: 'El concepto no puede superar 200 caracteres' })
  concept: string;

  @ApiProperty({ enum: ExtraIncomeCategory, description: 'Categoría del ingreso extra', example: ExtraIncomeCategory.VENTA_PRODUCTOS })
  @IsEnum(ExtraIncomeCategory, { message: 'Categoría de ingreso inválida' })
  category: ExtraIncomeCategory;

  @ApiProperty({ description: 'Monto del ingreso', example: 35000 })
  @IsNumber({}, { message: 'El monto debe ser un número válido' })
  @Min(0, { message: 'El monto no puede ser negativo' })
  amount: number;

  @ApiProperty({ description: 'Fecha del ingreso (YYYY-MM-DD)', example: '2026-09-21' })
  @IsDateString({}, { message: 'La fecha del ingreso no tiene un formato válido' })
  incomeDate: string;

  @ApiPropertyOptional({ description: 'Notas adicionales del ingreso' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
