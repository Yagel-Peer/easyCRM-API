const router = require('express').Router();

const {
  getSales,
  createSale,
  getSale,
  updateSale,
  deleteSale,
} = require('../controllers/sales');

router.route('/').get(getSales).post(createSale);
router.route('/:id').get(getSale).put(updateSale).delete(deleteSale);

module.exports = router;