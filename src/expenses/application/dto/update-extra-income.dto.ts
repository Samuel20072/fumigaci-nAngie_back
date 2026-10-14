import { PartialType } from '@nestjs/swagger';
import { CreateExtraIncomeDto } from './create-extra-income.dto.js';

export class UpdateExtraIncomeDto extends PartialType(CreateExtraIncomeDto) {}
