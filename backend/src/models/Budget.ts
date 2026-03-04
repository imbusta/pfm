import { Budget, BudgetCategory, BudgetWithCategories } from '../types';
import db from '../db/connection';

export class BudgetModel {
  private static getBaseQuery(): string {
    return `
      SELECT
        b.id, b.year, b.month,
        bc.id AS bc_id,
        bc.category_id,
        bc.amount,
        COALESCE((
          SELECT SUM(ABS(t.amount))
          FROM transactions t
          WHERE t.category_id = bc.category_id
            AND EXTRACT(YEAR FROM t.date) = b.year
            AND EXTRACT(MONTH FROM t.date) = b.month
            AND t.deleted_at IS NULL
            AND t.type = 'expense'
        ), 0) AS total_spent,
        c.name AS category_name
      FROM budgets b
      LEFT JOIN budget_categories bc ON bc.budget_id = b.id
      LEFT JOIN categories c ON c.id = bc.category_id
    `;
  }

  private static groupRows(rows: any[]): BudgetWithCategories[] {
    const map = new Map<number, BudgetWithCategories>();

    for (const row of rows) {
      if (!map.has(row.id)) {
        map.set(row.id, {
          id: row.id,
          year: row.year,
          month: row.month,
          categories: [],
        });
      }

      if (row.bc_id !== null) {
        map.get(row.id)!.categories.push({
          id: row.bc_id,
          budget_id: row.id,
          category_id: row.category_id,
          amount: parseFloat(row.amount),
          total_spent: parseFloat(row.total_spent),
          category_name: row.category_name,
        });
      }
    }

    return Array.from(map.values());
  }

  static async findAll(): Promise<BudgetWithCategories[]> {
    const query = `
      ${this.getBaseQuery()}
      ORDER BY b.year DESC, b.month DESC
    `;
    const result = await db.query(query);
    return this.groupRows(result.rows);
  }

  static async findById(id: number): Promise<BudgetWithCategories | null> {
    const query = `
      ${this.getBaseQuery()}
      WHERE b.id = $1
    `;
    const result = await db.query(query, [id]);
    const grouped = this.groupRows(result.rows);
    return grouped.length > 0 ? grouped[0] : null;
  }

  static async findByYearMonth(year: number, month: number): Promise<BudgetWithCategories | null> {
    const query = `
      ${this.getBaseQuery()}
      WHERE b.year = $1 AND b.month = $2
    `;
    const result = await db.query(query, [year, month]);
    const grouped = this.groupRows(result.rows);
    return grouped.length > 0 ? grouped[0] : null;
  }

  static async create(year: number, month: number): Promise<Budget> {
    const query = `
      INSERT INTO budgets (year, month) VALUES ($1, $2) RETURNING *
    `;
    const result = await db.query(query, [year, month]);
    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM budgets WHERE id = $1 RETURNING id`;
    const result = await db.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  static async addCategory(budgetId: number, categoryId: number, amount: number): Promise<BudgetCategory> {
    const query = `
      INSERT INTO budget_categories (budget_id, category_id, amount, total_spent)
      VALUES ($1, $2, $3, 0) RETURNING *
    `;
    const result = await db.query(query, [budgetId, categoryId, amount]);
    return result.rows[0];
  }

  static async updateCategory(
    id: number,
    data: { amount?: number; total_spent?: number }
  ): Promise<BudgetCategory | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.amount !== undefined) {
      updates.push(`amount = $${paramIndex++}`);
      values.push(data.amount);
    }
    if (data.total_spent !== undefined) {
      updates.push(`total_spent = $${paramIndex++}`);
      values.push(data.total_spent);
    }

    if (updates.length === 0) {
      const result = await db.query('SELECT * FROM budget_categories WHERE id = $1', [id]);
      return result.rows[0] || null;
    }

    values.push(id);
    const query = `
      UPDATE budget_categories
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  static async removeCategory(id: number): Promise<boolean> {
    const query = `DELETE FROM budget_categories WHERE id = $1 RETURNING id`;
    const result = await db.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  static async recalculateTotalSpent(year: number, month: number, categoryId: number): Promise<void> {
    const query = `
      UPDATE budget_categories bc
      SET total_spent = (
        SELECT COALESCE(SUM(ABS(t.amount)), 0)
        FROM transactions t
        WHERE t.category_id = $3
          AND EXTRACT(YEAR FROM t.date) = $1
          AND EXTRACT(MONTH FROM t.date) = $2
          AND t.deleted_at IS NULL
          AND t.type = 'expense'
      )
      WHERE bc.category_id = $3
        AND bc.budget_id = (
          SELECT id FROM budgets WHERE year = $1 AND month = $2 LIMIT 1
        )
    `;
    await db.query(query, [year, month, categoryId]);
  }
}

export default BudgetModel;
