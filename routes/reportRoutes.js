const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authToken = require('../controllers/middleware/authToken');
const authRoles = require('../controllers/middleware/authRoles');


router.get('/', reportController.GetAllReports);
router.get('/incident-types/location/:location',authToken, authRoles('admin'), reportController.GetIncidentTypesByLocation);
router.get('/status', authToken, authRoles('admin'), reportController.GetReportStatusSummary);
router.get('/type',authToken, authRoles('admin'), reportController.GetIncidentTypeSummary);
router.get('/:id', reportController.GetReportById);
router.get('/:id', reportController.GetReportsByCounsellor);
router.get('/:id',authToken, reportController.GetReportsBySurvivor);
router.post('/assign/:id',reportController.AssignCounsellorToReport) //how to decide which counsellors get which reports?

module.exports = router;