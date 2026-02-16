import db from '../db/connection';

export interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  created_at: Date;
  updated_at: Date;
}

class SubcategoryModel {
  static async findAll(): Promise<Subcategory[]> {
    const result = await db.query(
      'SELECT * FROM subcategories ORDER BY name ASC'
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Subcategory | null> {
    const result = await db.query(
      'SELECT * FROM subcategories WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByCategoryId(categoryId: number): Promise<Subcategory[]> {
    const result = await db.query(
      'SELECT * FROM subcategories WHERE category_id = $1 ORDER BY name ASC',
      [categoryId]
    );
    return result.rows;
  }

  static async findByName(name: string, categoryId?: number): Promise<Subcategory | null> {
    let query = 'SELECT * FROM subcategories WHERE LOWER(name) = LOWER($1)';
    const params: any[] = [name];

    if (categoryId !== undefined) {
      query += ' AND category_id = $2';
      params.push(categoryId);
    }

    const result = await db.query(query, params);
    return result.rows[0] || null;
  }

  static async create(name: string, categoryId: number): Promise<Subcategory> {
    const result = await db.query(
      `INSERT INTO subcategories (name, category_id, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING *`,
      [name, categoryId]
    );
    return result.rows[0];
  }

  static async update(id: number, name: string): Promise<Subcategory | null> {
    const result = await db.query(
      `UPDATE subcategories
       SET name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [name, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db.query(
      'DELETE FROM subcategories WHERE id = $1',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export default SubcategoryModel;
