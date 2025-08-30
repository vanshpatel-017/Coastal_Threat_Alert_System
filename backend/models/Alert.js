const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  severity: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  recipients: [{ type: String }],
  status: { type: String, default: "sent" }, // 'sent', 'failed'
});

module.exports = mongoose.model("Alert", alertSchema);
