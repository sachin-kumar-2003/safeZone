const express = require('express');
const router = express.Router();
const { createAlert , deleteAlert , updateAlert ,getAlertById, getUserAlerts ,getAllAlerts} = require('../controllers/alertController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/all', protect, getAllAlerts);
router.post('/create', protect, createAlert);
router.get('/user', protect, getUserAlerts);
router.get('/:id',protect , getAlertById);
router.delete('/delete/:id', protect,deleteAlert);
router.put('/update/:id', protect, updateAlert);
module.exports = router;