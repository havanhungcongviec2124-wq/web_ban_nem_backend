const express = require('express');
const router = express.Router();
const comboController = require('../controllers/combo.controller');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');

router.get('/', comboController.getCombos);
router.get('/:id', comboController.getComboById);
router.post('/', authenticate, authorizeAdmin, comboController.createCombo);
router.put('/:id', authenticate, authorizeAdmin, comboController.updateCombo);
router.delete('/:id', authenticate, authorizeAdmin, comboController.deleteCombo);

module.exports = router;
