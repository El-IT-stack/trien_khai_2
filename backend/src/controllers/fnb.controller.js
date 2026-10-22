const FnbModel = require('../models/fnb.model');

const FnbController = {
  async getAll(req, res, next) {
    try {
      const activeOnly = req.query.all !== 'true';
      const category = req.query.category || null;
      const items = await FnbModel.getAll({ category, activeOnly });
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const item = await FnbModel.getById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Mặt hàng F&B không tồn tại.' });
      }
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name, category, price, image_url, description } = req.body;
      if (!name || !price) {
        return res.status(400).json({ success: false, message: 'Tên mặt hàng và giá bán là bắt buộc.' });
      }
      const newItem = await FnbModel.create({ name, category, price, image_url, description });
      res.status(201).json({ success: true, data: newItem, message: 'Thêm mặt hàng F&B thành công.' });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await FnbModel.update(req.params.id, req.body);
      res.json({ success: true, data: updated, message: 'Cập nhật mặt hàng F&B thành công.' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await FnbModel.delete(req.params.id);
      res.json({ success: true, message: 'Đã ngừng kinh doanh mặt hàng F&B này.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = FnbController;
