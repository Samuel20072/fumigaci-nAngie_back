import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Nombre completo del cliente', example: 'María García López' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(150, { message: 'El nombre no puede superar 150 caracteres' })
  fullName: string;

  @ApiProperty({ description: 'Teléfono de contacto', example: '3001234567' })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @Matches(/^[\d\s\+\-\(\)]{7,20}$/, { message: 'El teléfono no tiene un formato válido' })
  phone: string;

  @ApiProperty({ description: 'Dirección del cliente', example: 'Calle 45 # 23-10' })
  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @MaxLength(250, { message: 'La dirección no puede superar 250 caracteres' })
  address: string;

  @ApiPropertyOptional({ description: 'Barrio', example: 'El Poblado' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  neighborhood?: string;

  @ApiPropertyOptional({ description: 'Ciudad o municipio', example: 'Medellín' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'Notas adicionales sobre el cliente' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
