import { Goal } from '../types';

export class GoalModel {
  private static goals: Goal[] = [];

  static async findAll(): Promise<Goal[]> {
    return this.goals;
  }

  static async findById(id: string): Promise<Goal | undefined> {
    return this.goals.find(g => g.id === id);
  }

  static async create(data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    const goal: Goal = {
      id: this.generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.goals.push(goal);
    return goal;
  }

  static async update(id: string, data: Partial<Goal>): Promise<Goal | undefined> {
    const index = this.goals.findIndex(g => g.id === id);
    if (index === -1) return undefined;

    this.goals[index] = {
      ...this.goals[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.goals[index];
  }

  static async delete(id: string): Promise<boolean> {
    const index = this.goals.findIndex(g => g.id === id);
    if (index === -1) return false;
    this.goals.splice(index, 1);
    return true;
  }

  private static generateId(): string {
    return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default GoalModel;
