const db = require("../models");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).send("Email is required");
    }

    const Student = db.Student;
    const Faculty = db.Faculty;
    const user = await Student.findOne({ emailId }) || await Faculty.findOne({ emailId });

    if (!user) {
      return res.status(403).send("Email not in database");
    }

    // Generate reset token (valid for 1 hour)
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Create transporter for Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.in", // smtp.zoho.in
      port: Number(process.env.SMTP_PORT) || 465, // 465
      secure: true,
      auth: {
        user: process.env.EMAILFROM, // supports@apurvasoftwaresolutions.com
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: process.env.EMAILFROM,
      to: user.emailId,
      subject: "Password Reset Request",
      text:
        `You are receiving this because you (or someone else) requested a password reset.\n\n` +
        `Please click on the following link, or paste it into your browser to reset your password within 1 hour:\n\n` +
        `http://localhost:3000/reset/${token}\n\n` +
        `If you did not request this, please ignore this email. Your password will remain unchanged.\n`,
    };

    console.log("mailOptions",mailOptions);
    console.log(process.env.SMTP_HOST);
    console.log(process.env.SMTP_PORT);
    console.log(process.env.EMAIL_PASSWORD);
    

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email send error:", err);
        return res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json("Recovery email sent successfully");
      }
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).send("Internal server error");
  }
};
