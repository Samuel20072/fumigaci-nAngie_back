import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerOrmEntity } from './infrastructure/persistence/entities/customer.orm-entity.js';
import { CustomerRepository } from './infrastructure/persistence/repositories/customer.repository.js';
import { ICustomerRepository } from './domain/repositories/customer.repository.interface.js';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case.js';
import { UpdateCustomerUseCase } from './application/use-cases/update-customer.use-case.js';
import { GetCustomerUseCase } from './application/use-cases/get-customer.use-case.js';
import { ListCustomersUseCase } from './application/use-cases/list-customers.use-case.js';
import { SearchCustomersUseCase } from './application/use-cases/search-customers.use-case.js';
import { DeactivateCustomerUseCase } from './application/use-cases/deactivate-customer.use-case.js';
import { CustomersController } from './presentation/customers.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  controllers: [CustomersController],
  providers: [
    // Bind interface → implementation (IoC)
    { provide: ICustomerRepository, useClass: CustomerRepository },
    CreateCustomerUseCase,
    UpdateCustomerUseCase,
    GetCustomerUseCase,
    ListCustomersUseCase,
    SearchCustomersUseCase,
    DeactivateCustomerUseCase,
  ],
  exports: [ICustomerRepository],
})
export class CustomersModule {}
