const twilio = require("twilio");
const nodemailer = require("nodemailer");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 📩 Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or smtp host/port if not Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send SMS
const sendSMS = async (req, res) => {
  try {
    const { to, message } = req.body;

    const msg = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    res.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error("SMS Error:", err);
    res.status(500).json({ error: "Failed to send SMS" });
  }
};

// ✅ Send Email
const sendEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = { sendSMS, sendEmail };
