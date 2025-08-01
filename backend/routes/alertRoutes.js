const express = require('express');
const router = express.Router();
const { createAlert, getAlerts } = require('../controllers/alertController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createAlert);
router.get('/', getAlerts);
module.exports = router;

