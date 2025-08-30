// controllers/reportController.js

const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Report = require("../models/ReportModel.js");

// Search by city
const getReportsByCity = async (req, res) => {
  try {
    const { city } = req.query; // e.g. /search?city=Delhi
    const reports = await Report.find({ city: city });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports", error: err });
  }
};

// Export CSV
const exportReportsCSV = async (req, res) => {
  try {
    const reports = await Report.find();
    const fields = ["city", "metric", "value", "timestamp"];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(reports);

    res.header("Content-Type", "text/csv");
    res.attachment("reports.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Error exporting CSV", error: err });
  }
};

// Export PDF
const exportReportsPDF = async (req, res) => {
  try {
    const reports = await Report.find();

    const doc = new PDFDocument();
    const filePath = path.join("exports", `reports_${Date.now()}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text("Reports Export", { align: "center" });
    doc.moveDown();

    reports.forEach((r) => {
      doc.fontSize(12).text(
        `City: ${r.city} | Metric: ${r.metric} | Value: ${r.value} | Time: ${r.timestamp}`
      );
      doc.moveDown(0.5);
    });

    doc.end();

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Error exporting PDF", error: err });
  }
};

module.exports = { getReportsByCity, exportReportsCSV, exportReportsPDF };