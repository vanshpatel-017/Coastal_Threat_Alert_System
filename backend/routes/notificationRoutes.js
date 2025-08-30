const express = require("express");
const { sendSMS, sendEmail } = require("../controllers/notificationController");

const router = express.Router();

router.post("/sms", sendSMS);
router.post("/email", sendEmail);

module.exports = router;
