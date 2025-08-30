const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

// Create new alert
router.post("/alerts", async (req, res) => {
  try {
    const { severity, type, title, description, location, recipients, status } = req.body;

    const newAlert = new Alert({
      severity,
      type,
      title,
      description,
      location,
      recipients,
      status: status || "sent",
    });

    const savedAlert = await newAlert.save();
    res.status(201).json(savedAlert);
  } catch (err) {
    console.error("Error creating alert:", err);
    res.status(500).json({ message: "Error creating alert" });
  }
});

// Get all alerts (latest 50)
router.get("/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ sentAt: -1 }).limit(50);
    res.json(alerts);
  } catch (err) {
    console.error("Error fetching alerts:", err);
    res.status(500).json({ message: "Error fetching alerts" });
  }
});

// Get single alert by ID
router.get("/alerts/:id", async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (err) {
    console.error("Error fetching alert:", err);
    res.status(500).json({ message: "Error fetching alert" });
  }
});

// Update alert
router.put("/alerts/:id", async (req, res) => {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAlert) return res.status(404).json({ message: "Alert not found" });
    res.json(updatedAlert);
  } catch (err) {
    console.error("Error updating alert:", err);
    res.status(500).json({ message: "Error updating alert" });
  }
});

// Delete alert
router.delete("/alerts/:id", async (req, res) => {
  try {
    const deleted = await Alert.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Alert not found" });
    res.json({ message: "Alert deleted successfully" });
  } catch (err) {
    console.error("Error deleting alert:", err);
    res.status(500).json({ message: "Error deleting alert" });
  }
});

module.exports = router;
