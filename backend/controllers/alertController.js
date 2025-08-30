// alertController.js
import express from "express";
import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from 'dotenv';
dotenv.config();

// Setup router
const router = express.Router();

// Configure email transporter (example with Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Transporter Error:", error);
  } else {
    console.log("✅ Email transporter ready");
  }
});

// Configure Twilio client
const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Mock user data with contact info and preferences
const users = [
  {
    id: 1,
    name: "Disaster Authority",
    email: "ssamdeepkkumar@gmail.com",
    phone: "+917303042793",
    roles: ["authority"],
  },
  { id: 2, name: 'NGO Group', email: 'raikislay1@gmail.com', phone: '+917303042793', roles: ['ngo'] },
  // { id: 3, name: 'Local Fisherfolk', phone: '+11234567892', roles: ['community'] }, // No email for SMS only user
];

// Helper to filter users by role
function getUsersByRole(role) {
  return users.filter((u) => u.roles.includes(role));
}

// POST /alerts - receive alert data and send notifications
router.post("/alerts", async (req, res) => {
  const { severity, type, title, description, location } = req.body;

  if (!severity || !title || !description) {
    return res.status(400).json({ message: "Missing alert details" });
  }

  // Prepare message content
  const subject = `[ALERT - ${severity.toUpperCase()}] ${title}`;
  const message = `${description}\nLocation: ${location}`;
  try {
    // Send emails to authorities and NGOs
    const emailRoles = ["authority", "ngo"];
    for (const role of emailRoles) {
      const roleUsers = getUsersByRole(role);
      for (const user of roleUsers) {
        if (user.email) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject,
            text: message,
          });
        }
      }
    }
    // Send SMS to all users (communities, authorities, NGOs)
    for (const user of users) {
      if (user.phone) {
        await twilioClient.messages.create({
          body: `${subject}\n${message}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: user.phone,
        });
      }
    }

    return res.status(200).json({ message: "Alerts sent successfully" });
  } catch (err) {
    console.error("Alert dispatch error:", err);
    return res.status(500).json({ message: "Failed to send alerts" });
  }
});

export default router;
