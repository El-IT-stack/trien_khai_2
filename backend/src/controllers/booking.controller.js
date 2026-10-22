const BookingModel = require('../models/booking.model');
const UserModel = require('../models/user.model');
const VoucherModel = require('../models/voucher.model');
const { logger } = require('../config/logger');

const BookingController = {
  async createBooking(req, res, next) {
    try {
      const userId = req.user.id;
      const { booking_type, showtime_id, seat_items, event_id, ticket_items } = req.body;

      if (!booking_type) {
        return res.status(400).json({
          success: false,
          message: 'Loại đặt vé (booking_type) không được để trống.'
        });
      }

      let result;

      if (booking_type === 'movie') {
        if (!showtime_id || !Array.isArray(seat_items) || seat_items.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Vui lòng chọn suất chiếu và ít nhất 1 ghế ngồi.'
          });
        }

        result = await BookingModel.createMovieBooking({
          userId,
          showtimeId: showtime_id,
          seatItems: seat_items,
          fnbItems: req.body.fnb_items || [],
          voucherCode: req.body.voucher_code || null,
          isCounterSale: req.body.is_counter_sale ? 1 : 0,
          cashierId: (req.user && ['admin', 'manager', 'staff'].includes(req.user.role)) ? req.user.id : null
        });

        await UserModel.logAudit(
          userId,
          'CREATE_BOOKING_MOVIE',
          'booking',
          `Đặt vé xem phim (${seat_items.length} ghế, ${req.body.fnb_items ? req.body.fnb_items.length : 0} F&B) - Mã: ${result.bookingCode} - Tổng: ${result.finalAmount || result.totalAmount}đ`,
          req.ip
        );
      } else if (booking_type === 'event') {
        if (!event_id || !Array.isArray(ticket_items) || ticket_items.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Vui lòng chọn sự kiện và số lượng vé hợp lệ.'
          });
        }

        // Calculate total amount
        const totalAmount = ticket_items.reduce((sum, item) => {
          item.subtotal = parseFloat(item.unit_price) * parseInt(item.quantity, 10);
          return sum + item.subtotal;
        }, 0);

        result = await BookingModel.createEventBooking({
          userId,
          eventId: event_id,
          ticketItems: ticket_items,
          totalAmount
        });

        await UserModel.logAudit(
          userId,
          'CREATE_BOOKING_EVENT',
          'booking',
          `Đặt vé sự kiện - Mã: ${result.bookingCode} - Tổng: ${totalAmount}đ`,
          req.ip
        );
      } else {
        return res.status(400).json({
          success: false,
          message: `Loại đặt vé '${booking_type}' không hợp lệ.`
        });
      }

      logger.info(`Tạo đơn đặt vé thành công: Mã [${result.bookingCode}] User ID [${userId}]`);

      res.status(201).json({
        success: true,
        message: 'Tạo đơn đặt vé thành công. Vui lòng hoàn tất thanh toán trong vòng 5 phút để giữ chỗ.',
        data: result
      });
    } catch (err) {
      logger.warn(`Lỗi tạo đơn đặt vé: ${err.message}`);
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  },

  async getBookingDetail(req, res, next) {
    try {
      const { idOrCode } = req.params;
      let booking;
      if (!isNaN(idOrCode)) {
        booking = await BookingModel.getById(idOrCode);
      } else {
        booking = await BookingModel.getByCode(idOrCode);
      }

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn đặt vé.'
        });
      }

      // Check ownership unless staff/manager/admin
      if (req.user.role_name === 'customer' && booking.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền xem đơn đặt vé này.'
        });
      }

      res.json({
        success: true,
        data: booking
      });
    } catch (err) {
      next(err);
    }
  },

  async getMyBookings(req, res, next) {
    try {
      const bookings = await BookingModel.getByUserId(req.user.id);
      res.json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (err) {
      next(err);
    }
  },

  async getAllBookings(req, res, next) {
    try {
      const { status, type, search } = req.query;
      const bookings = await BookingModel.getAll({ status, type, search });
      res.json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (err) {
      next(err);
    }
  },

  async applyVoucher(req, res, next) {
    try {
      const { code, total_amount } = req.body;
      if (!code || total_amount === undefined || total_amount === null) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp mã giảm giá và tổng tiền đơn hàng.'
        });
      }
      const userId = req.user ? req.user.id : null;
      const result = await VoucherModel.validateAndCalculate(code, total_amount, userId);
      res.json({
        success: true,
        data: result
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }
};

module.exports = BookingController;
