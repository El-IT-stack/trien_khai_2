const express = require('express');
const router = express.Router();
const FnbController = require('../controllers/fnb.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Public route to view F&B menu
router.get('/', FnbController.getAll);
router.get('/:id', FnbController.getById);

// Admin & Manager routes
router.post('/', authenticate, authorize(['admin', 'manager']), FnbController.create);
router.put('/:id', authenticate, authorize(['admin', 'manager']), FnbController.update);
router.delete('/:id', authenticate, authorize(['admin', 'manager']), FnbController.delete);

module.exports = router;
