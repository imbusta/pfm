import db from '../db/connection';

export interface Currency {
  id: number;
  name: string;
  code: string;
  created_at: Date;
  updated_at: Date;
}

class CurrencyModel {
  static async findAll(): Promise<Currency[]> {
    const result = await db.query(
      'SELECT * FROM currencies ORDER BY code ASC'
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Currency | null> {
    const result = await db.query(
      'SELECT * FROM currencies WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByCode(code: string): Promise<Currency | null> {
    const result = await db.query(
      'SELECT * FROM currencies WHERE UPPER(code) = UPPER($1)',
      [code]
    );
    return result.rows[0] || null;
  }

  static async create(name: string, code: string): Promise<Currency> {
    const result = await db.query(
      `INSERT INTO currencies (name, code, created_at, updated_at)
       VALUES ($1, UPPER($2), NOW(), NOW())
       RETURNING *`,
      [name, code]
    );
    return result.rows[0];
  }

  static async update(id: number, name: string, code: string): Promise<Currency | null> {
    const result = await db.query(
      `UPDATE currencies
       SET name = $1, code = UPPER($2), updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [name, code, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db.query(
      'DELETE FROM currencies WHERE id = $1',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export default CurrencyModel;
