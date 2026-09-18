import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateServiceUseCase } from '../application/use-cases/create-service.use-case.js';
import { UpdateServiceUseCase } from '../application/use-cases/update-service.use-case.js';
import { GetServiceUseCase } from '../application/use-cases/get-service.use-case.js';
import { ListServicesUseCase } from '../application/use-cases/list-services.use-case.js';
import { GetExpiringServicesUseCase } from '../application/use-cases/get-expiring-services.use-case.js';
import { GetExpiredServicesUseCase } from '../application/use-cases/get-expired-services.use-case.js';
import { GetServicesByCustomerUseCase } from '../application/use-cases/get-services-by-customer.use-case.js';
import { CreateServiceDto } from '../application/dto/create-service.dto.js';
import { UpdateServiceDto } from '../application/dto/update-service.dto.js';
import { ServiceResponseDto } from '../application/dto/service-response.dto.js';
import { IServiceRepository } from '../domain/repositories/service.repository.interface.js';
import { ServiceStatus } from '../domain/enums/service-status.enum.js';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(
    private readonly createService: CreateServiceUseCase,
    private readonly updateService: UpdateServiceUseCase,
    private readonly getService: GetServiceUseCase,
    private readonly listServices: ListServicesUseCase,
    private readonly getExpiring: GetExpiringServicesUseCase,
    private readonly getExpired: GetExpiredServicesUseCase,
    private readonly getByCustomer: GetServicesByCustomerUseCase,
    private readonly serviceRepository: IServiceRepository,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nuevo servicio (fumigación o repaso)' })
  @ApiResponse({ status: 201, type: ServiceResponseDto })
  create(@Body() dto: CreateServiceDto) {
    return this.createService.execute(dto);
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Servicios con vigencia próxima a vencer' })
  @ApiResponse({ status: 200, type: [ServiceResponseDto] })
  expiring() {
    return this.getExpiring.execute();
  }

  @Get('expired')
  @ApiOperation({ summary: 'Servicios con vigencia vencida' })
  @ApiResponse({ status: 200, type: [ServiceResponseDto] })
  expired() {
    return this.getExpired.execute();
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Historial de servicios de un cliente' })
  @ApiResponse({ status: 200, type: [ServiceResponseDto] })
  byCustomer(@Param('customerId', ParseUUIDPipe) customerId: string) {
    return this.getByCustomer.execute(customerId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los servicios' })
  @ApiResponse({ status: 200, type: [ServiceResponseDto] })
  findAll() {
    return this.listServices.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver detalle de un servicio' })
  @ApiResponse({ status: 200, type: ServiceResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getService.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar servicio' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancelar servicio' })
  async cancel(@Param('id', ParseUUIDPipe) id: string) {
    await this.serviceRepository.update(id, { status: ServiceStatus.CANCELADO });
  }
}
