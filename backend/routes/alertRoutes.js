const express = require('express');
const router = express.Router();
const { createAlert, getAlerts , deleteAlert, getUserAlerts, getAlertById } = require('../controllers/alertController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create', protect, createAlert);
router.get('/:id',protect , getAlertById);
router.delete('/delete/:id', protect,deleteAlert);
router.get('/user', protect, getUserAlerts);
module.exports = router;

