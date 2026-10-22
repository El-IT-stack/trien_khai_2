const { getPool } = require('../config/database');

const FnbModel = {
  async getAll({ category = null, activeOnly = true } = {}) {
    const pool = getPool();
    let query = 'SELECT * FROM fnb_items WHERE 1=1';
    const params = [];

    if (activeOnly) {
      query += ' AND is_active = 1';
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY category ASC, price ASC';

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async getById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM fnb_items WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ name, category = 'combo', price, image_url = null, description = null }) {
    const pool = getPool();
    const [res] = await pool.query(
      'INSERT INTO fnb_items (name, category, price, image_url, description, is_active) VALUES (?, ?, ?, ?, ?, 1)',
      [name, category, price, image_url, description]
    );
    return { id: res.insertId, name, category, price, image_url, description, is_active: 1 };
  },

  async update(id, { name, category, price, image_url, description, is_active }) {
    const pool = getPool();
    await pool.query(
      `UPDATE fnb_items 
       SET name = COALESCE(?, name),
           category = COALESCE(?, category),
           price = COALESCE(?, price),
           image_url = COALESCE(?, image_url),
           description = COALESCE(?, description),
           is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [name, category, price, image_url, description, is_active, id]
    );
    return this.getById(id);
  },

  async delete(id) {
    const pool = getPool();
    // Soft delete to maintain order history
    await pool.query('UPDATE fnb_items SET is_active = 0 WHERE id = ?', [id]);
    return true;
  }
};

module.exports = FnbModel;
