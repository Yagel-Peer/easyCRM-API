const router = require('express').Router();

const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products');

router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;