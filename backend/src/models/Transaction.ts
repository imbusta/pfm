import { Transaction, TransactionCreate } from '../types';
import db from '../db/connection';
import CategoryModel from './Category';
import SubcategoryModel from './Subcategory';
import CurrencyModel from './Currency';

export class TransactionModel {
  // Helper to build the base SELECT query with JOINs
  private static getBaseQuery(): string {
    return `
      SELECT
        t.*,
        c.name as category_name,
        s.name as subcategory_name,
        cur.code as currency_code
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN subcategories s ON t.subcategory_id = s.id
      LEFT JOIN currencies cur ON t.currency_id = cur.id
    `;
  }

  static async findAll(opts?: {
    limit?: number;
    offset?: number;
    search?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ rows: Transaction[]; total: number }> {
    const conditions: string[] = ['t.deleted_at IS NULL'];
    const values: any[] = [];
    let idx = 1;

    if (opts?.search) {
      conditions.push(`t.description ILIKE $${idx++}`);
      values.push(`%${opts.search}%`);
    }
    if (opts?.category) {
      conditions.push(`LOWER(c.name) = LOWER($${idx++})`);
      values.push(opts.category);
    }
    if (opts?.startDate) {
      conditions.push(`t.date >= $${idx++}`);
      values.push(opts.startDate);
    }
    if (opts?.endDate) {
      conditions.push(`t.date <= $${idx++}`);
      values.push(opts.endDate);
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    const countResult = await db.query(
      `SELECT COUNT(*) FROM transactions t LEFT JOIN categories c ON t.category_id = c.id ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const limit = opts?.limit ?? 20;
    const offset = opts?.offset ?? 0;
    const dataValues = [...values, limit, offset];

    const dataQuery = `
      ${this.getBaseQuery()}
      ${where}
      ORDER BY t.date DESC, t.created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    const result = await db.query(dataQuery, dataValues);
    return { rows: result.rows, total };
  }

  static async findById(id: number): Promise<Transaction | null> {
    const query = `
      ${this.getBaseQuery()}
      WHERE t.id = $1 AND t.deleted_at IS NULL
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create(data: TransactionCreate): Promise<Transaction> {
    // Resolve string-based category/subcategory/currency to IDs
    let categoryId = data.category_id;
    let subcategoryId = data.subcategory_id;
    let currencyId = data.currency_id;

    // Handle category string -> ID resolution
    if (data.category && !categoryId) {
      let category = await CategoryModel.findByName(data.category);
      if (!category) {
        category = await CategoryModel.create(data.category);
      }
      categoryId = category.id;
    }

    // Handle subcategory string -> ID resolution
    if (data.subcategory && !subcategoryId && categoryId) {
      let subcategory = await SubcategoryModel.findByName(data.subcategory, categoryId);
      if (!subcategory) {
        subcategory = await SubcategoryModel.create(data.subcategory, categoryId);
      }
      subcategoryId = subcategory.id;
    }

    // Handle currency string -> ID resolution (default to USD)
    if (!currencyId) {
      const currencyCode = data.currency || 'USD';
      let currency = await CurrencyModel.findByCode(currencyCode);
      if (!currency) {
        // If USD doesn't exist, try to create it
        if (currencyCode === 'USD') {
          currency = await CurrencyModel.create('US Dollar', 'USD');
        } else {
          // For other currencies, try to find USD or use the first available
          currency = await CurrencyModel.findByCode('USD');
          if (!currency) {
            const currencies = await CurrencyModel.findAll();
            if (currencies.length > 0) {
              currency = currencies[0];
            } else {
              throw new Error('No currencies available in database');
            }
          }
        }
      }
      currencyId = currency.id;
    }

    const query = `
      INSERT INTO transactions (
        description,
        amount,
        currency_id,
        category_id,
        subcategory_id,
        type,
        is_variable,
        date,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      data.description,
      data.amount,
      currencyId,
      categoryId || null,
      subcategoryId || null,
      data.type,
      data.is_variable !== undefined ? data.is_variable : true,
      data.date,
    ];

    const result = await db.query(query, values);
    const transactionId = result.rows[0].id;

    // Fetch the complete transaction with JOINs
    const transaction = await this.findById(transactionId);
    if (!transaction) {
      throw new Error('Failed to fetch created transaction');
    }

    return transaction;
  }

  static async update(id: number, data: Partial<TransactionCreate>): Promise<Transaction | null> {
    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Resolve string-based fields to IDs if provided
    let categoryId = data.category_id;
    let subcategoryId = data.subcategory_id;
    let currencyId = data.currency_id;

    if (data.category) {
      let category = await CategoryModel.findByName(data.category);
      if (!category) {
        category = await CategoryModel.create(data.category);
      }
      categoryId = category.id;
    }

    if (data.subcategory && categoryId) {
      let subcategory = await SubcategoryModel.findByName(data.subcategory, categoryId);
      if (!subcategory) {
        subcategory = await SubcategoryModel.create(data.subcategory, categoryId);
      }
      subcategoryId = subcategory.id;
    }

    if (data.currency) {
      const currency = await CurrencyModel.findByCode(data.currency);
      if (currency) {
        currencyId = currency.id;
      }
    }

    // Build update fields
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.amount !== undefined) {
      updates.push(`amount = $${paramIndex++}`);
      values.push(data.amount);
    }
    if (currencyId !== undefined) {
      updates.push(`currency_id = $${paramIndex++}`);
      values.push(currencyId);
    }
    if (categoryId !== undefined) {
      updates.push(`category_id = $${paramIndex++}`);
      values.push(categoryId);
    }
    if (subcategoryId !== undefined) {
      updates.push(`subcategory_id = $${paramIndex++}`);
      values.push(subcategoryId);
    }
    if (data.type !== undefined) {
      updates.push(`type = $${paramIndex++}`);
      values.push(data.type);
    }
    if (data.is_variable !== undefined) {
      updates.push(`is_variable = $${paramIndex++}`);
      values.push(data.is_variable);
    }
    if (data.date !== undefined) {
      updates.push(`date = $${paramIndex++}`);
      values.push(data.date);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE transactions
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return null;
    }

    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    // Soft delete
    const query = `
      UPDATE transactions
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id
    `;
    const result = await db.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  static async hardDelete(id: number): Promise<boolean> {
    // Permanent delete
    const query = 'DELETE FROM transactions WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  static async findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    const query = `
      ${this.getBaseQuery()}
      WHERE t.date >= $1 AND t.date <= $2 AND t.deleted_at IS NULL
      ORDER BY t.date DESC, t.created_at DESC
    `;
    const result = await db.query(query, [startDate, endDate]);
    return result.rows;
  }

  static async findByCategoryId(categoryId: number): Promise<Transaction[]> {
    const query = `
      ${this.getBaseQuery()}
      WHERE t.category_id = $1 AND t.deleted_at IS NULL
      ORDER BY t.date DESC, t.created_at DESC
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
  }

  static async findByCategory(categoryName: string): Promise<Transaction[]> {
    const query = `
      ${this.getBaseQuery()}
      WHERE LOWER(c.name) = LOWER($1) AND t.deleted_at IS NULL
      ORDER BY t.date DESC, t.created_at DESC
    `;
    const result = await db.query(query, [categoryName]);
    return result.rows;
  }
}

export default TransactionModel;
