import { UserPreference } from '../types';

export class PreferenceModel {
  private static preferences: UserPreference[] = [];

  static async findByUserId(userId: string): Promise<UserPreference | undefined> {
    return this.preferences.find(p => p.userId === userId);
  }

  static async create(data: Omit<UserPreference, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserPreference> {
    const preference: UserPreference = {
      id: this.generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.preferences.push(preference);
    return preference;
  }

  static async update(userId: string, data: Partial<UserPreference>): Promise<UserPreference | undefined> {
    const index = this.preferences.findIndex(p => p.userId === userId);
    if (index === -1) return undefined;

    this.preferences[index] = {
      ...this.preferences[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.preferences[index];
  }

  private static generateId(): string {
    return `pref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default PreferenceModel;
