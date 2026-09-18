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
import { CreateCustomerUseCase } from '../application/use-cases/create-customer.use-case.js';
import { UpdateCustomerUseCase } from '../application/use-cases/update-customer.use-case.js';
import { GetCustomerUseCase } from '../application/use-cases/get-customer.use-case.js';
import { ListCustomersUseCase } from '../application/use-cases/list-customers.use-case.js';
import { SearchCustomersUseCase } from '../application/use-cases/search-customers.use-case.js';
import { DeactivateCustomerUseCase } from '../application/use-cases/deactivate-customer.use-case.js';
import { CreateCustomerDto } from '../application/dto/create-customer.dto.js';
import { UpdateCustomerDto } from '../application/dto/update-customer.dto.js';
import { CustomerResponseDto } from '../application/dto/customer-response.dto.js';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly createCustomer: CreateCustomerUseCase,
    private readonly updateCustomer: UpdateCustomerUseCase,
    private readonly getCustomer: GetCustomerUseCase,
    private readonly listCustomers: ListCustomersUseCase,
    private readonly searchCustomers: SearchCustomersUseCase,
    private readonly deactivateCustomer: DeactivateCustomerUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nuevo cliente' })
  @ApiResponse({ status: 201, type: CustomerResponseDto })
  @ApiResponse({ status: 409, description: 'Ya existe un cliente con ese teléfono' })
  create(@Body() dto: CreateCustomerDto) {
    return this.createCustomer.execute(dto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar clientes por nombre, teléfono o dirección' })
  @ApiQuery({ name: 'q', description: 'Término de búsqueda (mínimo 2 caracteres)' })
  @ApiResponse({ status: 200, type: [CustomerResponseDto] })
  search(@Query('q') q: string) {
    return this.searchCustomers.execute(q);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [CustomerResponseDto] })
  findAll(@Query('isActive') isActive?: string) {
    const filter = isActive === undefined ? undefined : isActive === 'true';
    return this.listCustomers.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver detalle de un cliente' })
  @ApiResponse({ status: 200, type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getCustomer.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos del cliente' })
  @ApiResponse({ status: 200, type: CustomerResponseDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.updateCustomer.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar cliente (soft delete)' })
  @ApiResponse({ status: 204, description: 'Cliente desactivado correctamente' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deactivateCustomer.execute(id);
  }
}
