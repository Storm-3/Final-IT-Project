const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authToken = require('../controllers/middleware/authToken');


router.get('/', reportController.GetAllReports);
router.get('/:id', reportController.GetReportById);
router.get('/:id', reportController.GetReportsByCounsellor);
router.get('/:id', reportController.GetReportsBySurvivor);
router.get('/incident-types/location/:location', reportController.GetIncidentTypesByLocation);
router.post('/:id',reportController.AssignCounsellorToReport)

module.exports = router;