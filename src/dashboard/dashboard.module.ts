import { Module } from '@nestjs/common';
import { DashboardController } from './presentation/dashboard.controller.js';
import { GetSummaryUseCase } from './application/use-cases/get-summary.use-case.js';
import { CustomersModule } from '../customers/customers.module.js';
import { ServicesModule } from '../services/services.module.js';

@Module({
  imports: [CustomersModule, ServicesModule],
  controllers: [DashboardController],
  providers: [GetSummaryUseCase],
})
export class DashboardModule {}
