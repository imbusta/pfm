import { Budget } from '../types';

export class BudgetModel {
  private static budgets: Budget[] = [];

  static async findAll(): Promise<Budget[]> {
    return this.budgets;
  }

  static async findById(id: string): Promise<Budget | undefined> {
    return this.budgets.find(b => b.id === id);
  }

  static async create(data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
    const budget: Budget = {
      id: this.generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.budgets.push(budget);
    return budget;
  }

  static async update(id: string, data: Partial<Budget>): Promise<Budget | undefined> {
    const index = this.budgets.findIndex(b => b.id === id);
    if (index === -1) return undefined;

    this.budgets[index] = {
      ...this.budgets[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.budgets[index];
  }

  static async delete(id: string): Promise<boolean> {
    const index = this.budgets.findIndex(b => b.id === id);
    if (index === -1) return false;
    this.budgets.splice(index, 1);
    return true;
  }

  static async findByCategory(category: string): Promise<Budget[]> {
    return this.budgets.filter(b => b.category === category);
  }

  private static generateId(): string {
    return `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default BudgetModel;
