const router = require('express').Router({ mergeParams: true });

const { getRecords, createRecord, getRecord, updateRecord, deleteRecord } = require('../controllers/records');

router.route('/').get(getRecords).post(createRecord);
router.route('/:id').get(getRecord).put(updateRecord).delete(deleteRecord);

module.exports = router;
