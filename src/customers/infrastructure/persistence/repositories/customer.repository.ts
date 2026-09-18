import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CustomerOrmEntity } from '../entities/customer.orm-entity.js';
import {
  ICustomerRepository,
  CustomerFilters,
} from '../../../domain/repositories/customer.repository.interface.js';
import { Customer } from '../../../domain/entities/customer.entity.js';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repo: Repository<CustomerOrmEntity>,
  ) {}

  private toDomain(orm: CustomerOrmEntity): Customer {
    const customer = new Customer();
    customer.id = orm.id;
    customer.fullName = orm.fullName;
    customer.phone = orm.phone;
    customer.address = orm.address;
    customer.neighborhood = orm.neighborhood;
    customer.city = orm.city;
    customer.notes = orm.notes;
    customer.isActive = orm.isActive;
    customer.createdAt = orm.createdAt;
    customer.updatedAt = orm.updatedAt;
    return customer;
  }

  async create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const orm = this.repo.create(data);
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Customer | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    const orm = await this.repo.findOne({ where: { phone } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(filters?: CustomerFilters): Promise<Customer[]> {
    const where: Record<string, unknown> = {};
    if (filters?.isActive !== undefined) {
      where['isActive'] = filters.isActive;
    }
    const list = await this.repo.find({
      where,
      order: { fullName: 'ASC' },
    });
    return list.map((o) => this.toDomain(o));
  }

  async search(query: string): Promise<Customer[]> {
    const list = await this.repo.find({
      where: [
        { fullName: ILike(`%${query}%`) },
        { phone: ILike(`%${query}%`) },
        { address: ILike(`%${query}%`) },
        { neighborhood: ILike(`%${query}%`) },
      ],
      order: { fullName: 'ASC' },
    });
    return list.map((o) => this.toDomain(o));
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    await this.repo.update(id, data as Partial<CustomerOrmEntity>);
    const updated = await this.repo.findOneOrFail({ where: { id } });
    return this.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repo.update(id, { isActive: false });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repo.count({ where: { id } });
    return count > 0;
  }
}
