const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const expenseController = require('../controllers/expenseController');

router.post('/:tripId', auth, expenseController.addExpense);
router.get('/:tripId', auth, expenseController.getTripExpenses);

module.exports = router;
