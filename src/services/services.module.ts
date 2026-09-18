import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrmEntity } from './infrastructure/persistence/entities/service.orm-entity.js';
import { ServiceRepository } from './infrastructure/persistence/repositories/service.repository.js';
import { IServiceRepository } from './domain/repositories/service.repository.interface.js';
import { ExpirationService } from './application/services/expiration.service.js';
import { CreateServiceUseCase } from './application/use-cases/create-service.use-case.js';
import { UpdateServiceUseCase } from './application/use-cases/update-service.use-case.js';
import { GetServiceUseCase } from './application/use-cases/get-service.use-case.js';
import { ListServicesUseCase } from './application/use-cases/list-services.use-case.js';
import { GetExpiringServicesUseCase } from './application/use-cases/get-expiring-services.use-case.js';
import { GetExpiredServicesUseCase } from './application/use-cases/get-expired-services.use-case.js';
import { GetServicesByCustomerUseCase } from './application/use-cases/get-services-by-customer.use-case.js';
import { ServicesController } from './presentation/services.controller.js';
import { CustomersModule } from '../customers/customers.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceOrmEntity]), CustomersModule],
  controllers: [ServicesController],
  providers: [
    { provide: IServiceRepository, useClass: ServiceRepository },
    ExpirationService,
    CreateServiceUseCase,
    UpdateServiceUseCase,
    GetServiceUseCase,
    ListServicesUseCase,
    GetExpiringServicesUseCase,
    GetExpiredServicesUseCase,
    GetServicesByCustomerUseCase,
  ],
  exports: [IServiceRepository, ExpirationService],
})
export class ServicesModule {}
