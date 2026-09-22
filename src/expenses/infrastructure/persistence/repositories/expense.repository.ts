import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { IExpenseRepository } from '../../../domain/repositories/expense.repository.interface.js';
import { Expense } from '../../../domain/entities/expense.entity.js';
import { ExpenseOrmEntity } from '../entities/expense.orm-entity.js';
import { ExpenseCategory } from '../../../domain/enums/expense-category.enum.js';

@Injectable()
export class ExpenseRepository implements IExpenseRepository {
  constructor(
    @InjectRepository(ExpenseOrmEntity)
    private readonly repo: Repository<ExpenseOrmEntity>,
  ) {}

  private toDomain(orm: ExpenseOrmEntity): Expense {
    return {
      id: orm.id,
      concept: orm.concept,
      category: orm.category,
      amount: Number(orm.amount),
      expenseDate: orm.expenseDate,
      isRecurring: orm.isRecurring,
      notes: orm.notes,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
  }

  async create(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const entity = this.repo.create({
      concept: data.concept,
      category: data.category,
      amount: data.amount,
      expenseDate: data.expenseDate,
      isRecurring: data.isRecurring,
      notes: data.notes,
    });
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Expense | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findAll(month?: string, category?: ExpenseCategory): Promise<Expense[]> {
    const qb = this.repo.createQueryBuilder('e');

    if (month) {
      // month format: YYYY-MM
      const [yearStr, monthStr] = month.split('-');
      const year = parseInt(yearStr, 10);
      const m = parseInt(monthStr, 10);
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 0, 23, 59, 59, 999);
      qb.andWhere('e.expense_date BETWEEN :start AND :end', {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      });
    }

    if (category) {
      qb.andWhere('e.category = :category', { category });
    }

    qb.orderBy('e.expense_date', 'DESC');
    qb.addOrderBy('e.created_at', 'DESC');

    const list = await qb.getMany();
    return list.map((item) => this.toDomain(item));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    const list = await this.repo.find({
      where: {
        expenseDate: Between(start as any, end as any),
      },
      order: { expenseDate: 'DESC' },
    });
    return list.map((item) => this.toDomain(item));
  }

  async update(id: string, data: Partial<Expense>): Promise<Expense> {
    await this.repo.update(id, data as Partial<ExpenseOrmEntity>);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado`);
    }
  }

  async sumByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    const result = await this.repo
      .createQueryBuilder('e')
      .select('SUM(e.amount)', 'total')
      .where('e.expense_date BETWEEN :start AND :end', { start, end })
      .getRawOne();

    return result?.total ? Number(result.total) : 0;
  }
}
