import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetSummaryUseCase } from '../application/use-cases/get-summary.use-case.js';
import { IServiceRepository } from '../../services/domain/repositories/service.repository.interface.js';
import { ExpirationService } from '../../services/application/services/expiration.service.js';
import { ServiceResponseDto } from '../../services/application/dto/service-response.dto.js';
import { ConfigService } from '@nestjs/config';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getSummary: GetSummaryUseCase,
    private readonly serviceRepo: IServiceRepository,
    private readonly expirationService: ExpirationService,
    private readonly config: ConfigService,
  ) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen general del negocio' })
  summary() {
    return this.getSummary.execute();
  }

  @Get('recent-services')
  @ApiOperation({ summary: 'Últimos servicios registrados' })
  async recentServices(): Promise<ServiceResponseDto[]> {
    const services = await this.serviceRepo.findAll();
    const recent = services.slice(0, 10);
    return recent.map((s) => {
      const status = this.expirationService.getStatus(s.expirationDate);
      const days = this.expirationService.getDaysRemaining(s.expirationDate);
      return ServiceResponseDto.fromEntity(s, status, days);
    });
  }

  @Get('expiring-customers')
  @ApiOperation({ summary: 'Clientes con vigencia próxima a vencer' })
  async expiringCustomers(): Promise<ServiceResponseDto[]> {
    const daysAhead = this.config.get<number>('EXPIRATION_ALERT_DAYS', 7);
    const services = await this.serviceRepo.findExpiring(daysAhead);
    return services.map((s) => {
      const status = this.expirationService.getStatus(s.expirationDate);
      const days = this.expirationService.getDaysRemaining(s.expirationDate);
      return ServiceResponseDto.fromEntity(s, status, days);
    });
  }
}
