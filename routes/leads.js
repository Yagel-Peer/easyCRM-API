const router = require('express').Router();

const {
  getLeads,
  createLead,
  getLead,
  updateLead,
  deleteLead,
} = require('../controllers/leads');

// include other resource routers
const recordsRouter = require('./records');

// re-route into other resource routers
router.use('/:leadId/records', recordsRouter);

router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getLead).put(updateLead).delete(deleteLead);

module.exports = router;
