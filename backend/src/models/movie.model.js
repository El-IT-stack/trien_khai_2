const { getPool } = require('../config/database');

const MovieModel = {
  async getAll({ status, genreId, search } = {}) {
    const pool = getPool();
    let query = `
      SELECT m.*, g.name as genre_name, g.slug as genre_slug 
      FROM movies m 
      LEFT JOIN genres g ON m.genre_id = g.id 
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND m.status = ?`;
      params.push(status);
    }
    if (genreId) {
      query += ` AND m.genre_id = ?`;
      params.push(genreId);
    }
    if (search) {
      query += ` AND (m.title LIKE ? OR m.director LIKE ? OR m.cast LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ` ORDER BY m.release_date DESC, m.id DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async getById(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT m.*, g.name as genre_name 
       FROM movies m 
       LEFT JOIN genres g ON m.genre_id = g.id 
       WHERE m.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async getBySlug(slug) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT m.*, g.name as genre_name 
       FROM movies m 
       LEFT JOIN genres g ON m.genre_id = g.id 
       WHERE m.slug = ?`,
      [slug]
    );
    return rows[0] || null;
  },

  async create(data) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO movies 
       (title, slug, genre_id, duration, release_date, end_date, director, cast, poster_url, banner_url, trailer_url, description, age_rating, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.slug,
        data.genre_id || null,
        data.duration,
        data.release_date,
        data.end_date || null,
        data.director || '',
        data.cast || '',
        data.poster_url || '',
        data.banner_url || '',
        data.trailer_url || '',
        data.description || '',
        data.age_rating || 'P',
        data.status || 'now_showing'
      ]
    );
    return result.insertId;
  },

  async update(id, data) {
    const pool = getPool();
    await pool.query(
      `UPDATE movies SET 
       title = ?, slug = ?, genre_id = ?, duration = ?, release_date = ?, 
       end_date = ?, director = ?, cast = ?, poster_url = ?, banner_url = ?, 
       trailer_url = ?, description = ?, age_rating = ?, status = ? 
       WHERE id = ?`,
      [
        data.title,
        data.slug,
        data.genre_id || null,
        data.duration,
        data.release_date,
        data.end_date || null,
        data.director,
        data.cast,
        data.poster_url,
        data.banner_url,
        data.trailer_url,
        data.description,
        data.age_rating,
        data.status,
        id
      ]
    );
  },

  async delete(id) {
    const pool = getPool();
    // Check if there are bookings for this movie to preserve transaction history
    const [bookings] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM bookings b
       JOIN showtimes s ON b.showtime_id = s.id
       WHERE s.movie_id = ?`,
      [id]
    );

    if (bookings[0].count > 0) {
      // Soft-delete: mark as 'ended' to prevent breaking historical records
      await pool.query("UPDATE movies SET status = 'ended' WHERE id = ?", [id]);
      return { softDeleted: true, message: 'Phim đã có lịch sử đặt vé, đã chuyển trạng thái sang "Ngừng chiếu" để bảo toàn dữ liệu giao dịch.' };
    } else {
      await pool.query('DELETE FROM movies WHERE id = ?', [id]);
      return { softDeleted: false, message: 'Đã xóa phim thành công.' };
    }
  },

  async getAllGenres() {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM genres ORDER BY name ASC');
    return rows;
  }
};

module.exports = MovieModel;
