import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between } from 'typeorm';
import { ServiceOrmEntity } from '../entities/service.orm-entity.js';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface.js';
import { Service } from '../../../domain/entities/service.entity.js';
import { ServiceType } from '../../../domain/enums/service-type.enum.js';
import { ServiceStatus } from '../../../domain/enums/service-status.enum.js';

@Injectable()
export class ServiceRepository implements IServiceRepository {
  constructor(
    @InjectRepository(ServiceOrmEntity)
    private readonly repo: Repository<ServiceOrmEntity>,
  ) {}

  private toDomain(orm: ServiceOrmEntity): Service {
    const s = new Service();
    s.id = orm.id;
    s.customerId = orm.customerId;
    s.type = orm.type;
    s.status = orm.status;
    s.serviceDate = orm.serviceDate;
    s.expirationDate = orm.expirationDate;
    s.price = orm.price;
    s.paymentMethod = orm.paymentMethod;
    s.notes = orm.notes;
    s.parentServiceId = orm.parentServiceId;
    s.createdAt = orm.createdAt;
    s.updatedAt = orm.updatedAt;
    return s;
  }

  async create(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    const orm = this.repo.create(data as Partial<ServiceOrmEntity>);
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Service | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<Service[]> {
    const list = await this.repo.find({ order: { serviceDate: 'DESC' } });
    return list.map((o) => this.toDomain(o));
  }

  async findByCustomerId(customerId: string): Promise<Service[]> {
    const list = await this.repo.find({
      where: { customerId },
      order: { serviceDate: 'DESC' },
    });
    return list.map((o) => this.toDomain(o));
  }

  async findExpiring(daysAhead: number): Promise<Service[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limit = new Date();
    limit.setDate(limit.getDate() + daysAhead);
    limit.setHours(23, 59, 59, 999);

    const list = await this.repo.find({
      where: {
        expirationDate: Between(today, limit),
        status: ServiceStatus.REALIZADO,
      },
      order: { expirationDate: 'ASC' },
    });
    return list.map((o) => this.toDomain(o));
  }

  async findExpired(): Promise<Service[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const list = await this.repo.find({
      where: {
        expirationDate: LessThan(today),
        status: ServiceStatus.REALIZADO,
      },
      order: { expirationDate: 'ASC' },
    });
    return list.map((o) => this.toDomain(o));
  }

  async findByType(type: ServiceType): Promise<Service[]> {
    const list = await this.repo.find({
      where: { type },
      order: { serviceDate: 'DESC' },
    });
    return list.map((o) => this.toDomain(o));
  }

  async findFumigacionesByCustomer(customerId: string): Promise<Service[]> {
    const list = await this.repo.find({
      where: { customerId, type: ServiceType.FUMIGACION },
      order: { serviceDate: 'DESC' },
    });
    return list.map((o) => this.toDomain(o));
  }

  async update(id: string, data: Partial<Service>): Promise<Service> {
    await this.repo.update(id, data as Partial<ServiceOrmEntity>);
    const updated = await this.repo.findOneOrFail({ where: { id } });
    return this.toDomain(updated);
  }

  async exists(id: string): Promise<boolean> {
    return (await this.repo.count({ where: { id } })) > 0;
  }

  async countByType(): Promise<{ fumigacion: number; repaso: number }> {
    const fumigacion = await this.repo.count({ where: { type: ServiceType.FUMIGACION } });
    const repaso = await this.repo.count({ where: { type: ServiceType.REPASO } });
    return { fumigacion, repaso };
  }

  async countTotal(): Promise<number> {
    return this.repo.count();
  }
}
