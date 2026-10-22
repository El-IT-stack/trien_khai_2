const { getPool } = require('../config/database');

const VoucherModel = {
  async getAll() {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM vouchers ORDER BY id DESC');
    return rows;
  },

  async getByCode(code) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM vouchers WHERE code = ?', [code.toUpperCase().trim()]);
    return rows[0] || null;
  },

  async validateAndCalculate(code, totalAmount, userId = null) {
    const voucher = await this.getByCode(code);
    if (!voucher) {
      throw new Error(`Mã giảm giá '${code}' không tồn tại trong hệ thống.`);
    }

    if (!voucher.is_active) {
      throw new Error(`Mã giảm giá '${code}' hiện đang tạm ngừng áp dụng.`);
    }

    const now = new Date();
    if (new Date(voucher.valid_from) > now || new Date(voucher.valid_to) < now) {
      throw new Error(`Mã giảm giá '${code}' đã hết hạn hoặc chưa đến ngày áp dụng.`);
    }

    if (voucher.usage_limit > 0 && voucher.used_count >= voucher.usage_limit) {
      throw new Error(`Mã giảm giá '${code}' đã hết lượt sử dụng.`);
    }

    if (Number(totalAmount) < Number(voucher.min_order_amount)) {
      throw new Error(
        `Đơn hàng cần đạt tối thiểu ${Number(voucher.min_order_amount).toLocaleString('vi-VN')} ₫ để áp dụng mã này.`
      );
    }

    let discountAmount = 0;
    if (voucher.discount_type === 'percent') {
      discountAmount = (Number(totalAmount) * Number(voucher.discount_value)) / 100;
      if (voucher.max_discount_amount > 0 && discountAmount > Number(voucher.max_discount_amount)) {
        discountAmount = Number(voucher.max_discount_amount);
      }
    } else {
      discountAmount = Number(voucher.discount_value);
    }

    // Discount cannot exceed order total
    discountAmount = Math.min(discountAmount, Number(totalAmount));
    const finalAmount = Math.max(0, Number(totalAmount) - discountAmount);

    return {
      voucher,
      discountAmount,
      finalAmount,
      message: `Áp dụng thành công mã '${voucher.code}'! Giảm ${discountAmount.toLocaleString('vi-VN')} ₫.`
    };
  },

  async recordUsage(voucherId, userId, bookingId, discountAmount, connection = null) {
    const db = connection || getPool();
    await db.query(
      'INSERT INTO voucher_usages (voucher_id, user_id, booking_id, discount_amount) VALUES (?, ?, ?, ?)',
      [voucherId, userId, bookingId, discountAmount]
    );
    await db.query('UPDATE vouchers SET used_count = used_count + 1 WHERE id = ?', [voucherId]);
  },

  async create({ code, description, discount_type = 'percent', discount_value, min_order_amount = 0, max_discount_amount = 100000, usage_limit = 500, valid_to }) {
    const pool = getPool();
    const [res] = await pool.query(
      `INSERT INTO vouchers 
       (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, valid_to, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [code.toUpperCase().trim(), description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, valid_to]
    );
    return { id: res.insertId, code, discount_value };
  }
};

module.exports = VoucherModel;
