const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const { logger } = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_cineevent_change_in_production_2026!';

const AuthController = {
  async register(req, res, next) {
    try {
      const { full_name, email, password, phone } = req.body;

      if (!full_name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ Họ và tên, Email và Mật khẩu.'
        });
      }

      // Check existing email
      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Email này đã được đăng ký tài khoản trên hệ thống.'
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      const userId = await UserModel.create({
        fullName: full_name,
        email,
        passwordHash,
        phone: phone || '',
        roleId: 4 // Default Customer role
      });

      // Audit log
      await UserModel.logAudit(userId, 'REGISTER', 'auth', `Khách hàng mới đăng ký tài khoản (${email})`, req.ip);

      // Create token
      const token = jwt.sign(
        {
          id: userId,
          role_id: 4,
          role_name: 'customer',
          email,
          full_name
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      logger.info(`Đăng ký tài khoản thành công: ${email} [ID: ${userId}]`);

      res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công!',
        data: {
          token,
          user: {
            id: userId,
            full_name,
            email,
            phone,
            role_name: 'customer'
          }
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập Email và Mật khẩu.'
        });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        logger.warn(`Đăng nhập thất bại: Không tìm thấy email '${email}'`);
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không chính xác.'
        });
      }

      if (user.status !== 'active') {
        logger.warn(`Tài khoản bị khóa đăng nhập: ${email} (status: ${user.status})`);
        return res.status(403).json({
          success: false,
          message: 'Tài khoản của bạn đang bị tạm khóa hoặc ngừng hoạt động. Vui lòng liên hệ quản trị viên.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        logger.warn(`Đăng nhập thất bại: Sai mật khẩu cho email '${email}'`);
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không chính xác.'
        });
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: user.id,
          role_id: user.role_id,
          role_name: user.role_name,
          email: user.email,
          full_name: user.full_name
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Audit log
      await UserModel.logAudit(user.id, 'LOGIN', 'auth', `Người dùng đăng nhập thành công (${user.email} - Vai trò: ${user.role_name})`, req.ip);

      logger.info(`Đăng nhập thành công: ${user.email} [Vai trò: ${user.role_name}]`);

      res.json({
        success: true,
        message: 'Đăng nhập thành công!',
        data: {
          token,
          user: {
            id: user.id,
            role_id: user.role_id,
            role_name: user.role_name,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            avatar_url: user.avatar_url,
            loyalty_points: user.loyalty_points || 0
          }
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin tài khoản.'
        });
      }
      res.json({
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { full_name, phone } = req.body;
      if (!full_name) {
        return res.status(400).json({ success: false, message: 'Họ và tên không được để trống.' });
      }
      const updatedUser = await UserModel.updateProfile(req.user.id, { fullName: full_name, phone });
      await UserModel.logAudit(req.user.id, 'UPDATE_PROFILE', 'auth', `Cập nhật thông tin cá nhân: ${full_name}`, req.ip);
      res.json({
        success: true,
        message: 'Cập nhật thông tin cá nhân thành công!',
        data: updatedUser
      });
    } catch (err) {
      next(err);
    }
  },

  async changePassword(req, res, next) {
    try {
      const { old_password, new_password } = req.body;
      if (!old_password || !new_password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu cũ và mật khẩu mới.' });
      }
      if (new_password.length < 6) {
        return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
      }

      const user = await UserModel.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại.' });
      }

      const isMatch = await bcrypt.compare(old_password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác.' });
      }

      const newHash = await bcrypt.hash(new_password, 10);
      await UserModel.updatePassword(req.user.id, newHash);
      await UserModel.logAudit(req.user.id, 'CHANGE_PASSWORD', 'auth', 'Đổi mật khẩu tài khoản thành công', req.ip);

      res.json({
        success: true,
        message: 'Đổi mật khẩu thành công! Vui lòng ghi nhớ mật khẩu mới.'
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AuthController;
