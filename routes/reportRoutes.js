// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authToken = require("../controllers/middleware/authToken");
const authRoles = require("../controllers/middleware/authRoles");


router.post("/", authToken, reportController.CreateReport);
router.get("/types", reportController.getIncidentTypes);
router.get("/",
  authToken,
  authRoles("admin"), reportController.GetAllReports);

router.get(
  "/incident-types/location/:location",
  authToken,
  authRoles("admin"),
  reportController.GetIncidentTypesByLocation
);
router.get(
  "/status",
  authToken,
  authRoles("admin"),
  reportController.GetReportStatusSummary
);
router.get(
  "/type",
  authToken,
  authRoles("admin"),
  reportController.GetIncidentTypeSummary
);

router.get("/:id", reportController.GetReportById);
router.get("/counsellor/:id", reportController.GetReportsByCounsellor);
router.get("/survivor/:id", authToken, reportController.GetReportsBySurvivor);
router.post(
  "/assign/:id",
  authToken,
  reportController.AssignCounsellorToReport
);

module.exports = router;
