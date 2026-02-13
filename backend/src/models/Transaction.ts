import { Transaction, TransactionCreate } from '../types';

export class TransactionModel {
  // In-memory storage for now (will be replaced with database)
  private static transactions: Transaction[] = [];

  static async findAll(): Promise<Transaction[]> {
    return this.transactions;
  }

  static async findById(id: string): Promise<Transaction | undefined> {
    return this.transactions.find(t => t.id === id);
  }

  static async create(data: TransactionCreate): Promise<Transaction> {
    const transaction: Transaction = {
      id: this.generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.transactions.push(transaction);
    return transaction;
  }

  static async update(id: string, data: Partial<TransactionCreate>): Promise<Transaction | undefined> {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return undefined;

    this.transactions[index] = {
      ...this.transactions[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.transactions[index];
  }

  static async delete(id: string): Promise<boolean> {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.transactions.splice(index, 1);
    return true;
  }

  static async findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    return this.transactions.filter(t => t.date >= startDate && t.date <= endDate);
  }

  static async findByCategory(category: string): Promise<Transaction[]> {
    return this.transactions.filter(t => t.category === category);
  }

  private static generateId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default TransactionModel;
