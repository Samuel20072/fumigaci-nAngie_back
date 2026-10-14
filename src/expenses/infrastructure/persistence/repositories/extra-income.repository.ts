import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IExtraIncomeRepository } from '../../../domain/repositories/extra-income.repository.interface.js';
import { ExtraIncome } from '../../../domain/entities/extra-income.entity.js';
import { ExtraIncomeOrmEntity } from '../entities/extra-income.orm-entity.js';
import { ExtraIncomeCategory } from '../../../domain/enums/extra-income-category.enum.js';

@Injectable()
export class ExtraIncomeRepository implements IExtraIncomeRepository {
  constructor(
    @InjectRepository(ExtraIncomeOrmEntity)
    private readonly repo: Repository<ExtraIncomeOrmEntity>,
  ) {}

  private toDomain(orm: ExtraIncomeOrmEntity): ExtraIncome {
    return {
      id: orm.id,
      concept: orm.concept,
      category: orm.category,
      amount: Number(orm.amount),
      incomeDate: orm.incomeDate,
      notes: orm.notes,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
  }

  async create(data: Omit<ExtraIncome, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExtraIncome> {
    const entity = this.repo.create({
      concept: data.concept,
      category: data.category,
      amount: data.amount,
      incomeDate: data.incomeDate,
      notes: data.notes,
    });
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<ExtraIncome | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findAll(month?: string, category?: ExtraIncomeCategory): Promise<ExtraIncome[]> {
    const qb = this.repo.createQueryBuilder('i');

    if (month) {
      const [yearStr, monthStr] = month.split('-');
      const year = parseInt(yearStr, 10);
      const m = parseInt(monthStr, 10);
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 0, 23, 59, 59, 999);
      qb.andWhere('i.income_date BETWEEN :start AND :end', {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      });
    }

    if (category) {
      qb.andWhere('i.category = :category', { category });
    }

    qb.orderBy('i.income_date', 'DESC');
    qb.addOrderBy('i.created_at', 'DESC');

    const list = await qb.getMany();
    return list.map((item) => this.toDomain(item));
  }

  async update(id: string, data: Partial<ExtraIncome>): Promise<ExtraIncome> {
    await this.repo.update(id, data as Partial<ExtraIncomeOrmEntity>);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException(`Ingreso extra con ID ${id} no encontrado`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`Ingreso extra con ID ${id} no encontrado`);
    }
  }

  async exists(id: string): Promise<boolean> {
    return (await this.repo.count({ where: { id } })) > 0;
  }
}
