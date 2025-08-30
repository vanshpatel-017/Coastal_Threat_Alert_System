const express = require("express");
const { exportReportsCSV, exportReportsPDF } = require("../controllers/reportController");

const router = express.Router();

router.get("/export/csv", exportReportsCSV);
router.get("/export/pdf", exportReportsPDF);

module.exports = router;
