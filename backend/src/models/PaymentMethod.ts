import db from '../db/connection';

export interface PaymentMethod {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

class PaymentMethodModel {
  static async findAll(): Promise<PaymentMethod[]> {
    const result = await db.query(
      'SELECT * FROM payment_methods ORDER BY name ASC'
    );
    return result.rows;
  }

  static async findById(id: number): Promise<PaymentMethod | null> {
    const result = await db.query(
      'SELECT * FROM payment_methods WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByName(name: string): Promise<PaymentMethod | null> {
    const result = await db.query(
      'SELECT * FROM payment_methods WHERE LOWER(name) = LOWER($1)',
      [name]
    );
    return result.rows[0] || null;
  }

  static async create(name: string): Promise<PaymentMethod> {
    const result = await db.query(
      `INSERT INTO payment_methods (name, created_at, updated_at)
       VALUES ($1, NOW(), NOW())
       RETURNING *`,
      [name]
    );
    return result.rows[0];
  }

  static async update(id: number, name: string): Promise<PaymentMethod | null> {
    const result = await db.query(
      `UPDATE payment_methods
       SET name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [name, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db.query(
      'DELETE FROM payment_methods WHERE id = $1',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export default PaymentMethodModel;
