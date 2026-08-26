import express from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Email transporter (initialized on first request)
let transporter = null;

// Initialize transporter
const getTransporter = () => {
  if (transporter) return transporter;

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  console.log("📧 Initializing email transporter...");
  console.log("📧 EMAIL_USER:", emailUser);

  // Check if credentials are configured
  if (!emailUser || !emailPass || emailUser === "your_email@gmail.com" || emailPass === "your_16_character_app_password") {
    console.log("❌ Email credentials not configured!");
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log("✅ Email transporter created successfully!");
    return transporter;
  } catch (error) {
    console.error("❌ Failed to create transporter:", error.message);
    return null;
  }
};

// Send EMI Report to Email
router.post("/send-report", async (req, res) => {
  try {
    console.log("\n=== 📧 Send Email Request ===");

    // Get token from header
    const authHeader = req.headers.authorization;
    console.log("📧 Auth header:", authHeader ? "Present" : "Missing");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Please login first" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("📧 Decoded user ID:", decoded.id);
    } catch (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("📧 User found:", user.email);

    const { loanDetails, schedule } = req.body;

    if (!loanDetails) {
      return res.status(400).json({ message: "Missing loan details" });
    }

    // Get transporter
    const mailTransporter = getTransporter();

    if (!mailTransporter) {
      console.log("❌ Transporter not available - credentials not configured");
      return res.status(500).json({ 
        message: "Email service not configured. Please contact administrator to set up email credentials." 
      });
    }

    // Verify transporter connection
    console.log("📧 Verifying transporter connection...");
    try {
      await mailTransporter.verify();
      console.log("✅ Transporter verified!");
    } catch (err) {
      console.error("❌ Transporter verification failed:", err.message);
      return res.status(500).json({ 
        message: "Email service connection failed. Please check email credentials." 
      });
    }

    // Create email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #10b981, #14b8a6); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; background: white; }
          .summary-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .summary-row:last-child { border-bottom: none; }
          .label { color: #6b7280; }
          .value { font-weight: bold; }
          .emi-value { color: #10b981; font-size: 18px; }
          .interest-value { color: #f97316; }
          .total-value { color: #8b5cf6; font-size: 18px; }
          .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏦 LoanPredict EMI Report</h1>
          </div>
          <div class="content">
            <p>Hello ${user.name || user.fullname || "User"},</p>
            <p>Your EMI calculation report is ready! Here are the details:</p>
            
            <div class="summary-box">
              <div class="summary-row">
                <span class="label">Loan Amount</span>
                <span class="value">₹${Number(loanDetails.loanAmount || 0).toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="label">Interest Rate</span>
                <span class="value">${loanDetails.interestRate || 0}% per annum</span>
              </div>
              <div class="summary-row">
                <span class="label">Tenure</span>
                <span class="value">${loanDetails.tenure || 0} months</span>
              </div>
              <div class="summary-row">
                <span class="label">Monthly EMI</span>
                <span class="value emi-value">₹${Number(loanDetails.emi || 0).toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="label">Total Interest</span>
                <span class="value interest-value">₹${Number(loanDetails.totalInterest || 0).toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="label">Total Payable</span>
                <span class="value total-value">₹${Number(loanDetails.totalPayment || 0).toLocaleString()}</span>
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              Thank you for using LoanPredict!
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} LoanPredict. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: `"LoanPredict" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "🏦 Your Loan EMI Report - LoanPredict",
      html: htmlContent,
    };

    console.log("📧 Sending email to:", user.email);

    // Send email
    const info = await mailTransporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    console.log("📧 Message ID:", info.messageId);

    res.status(200).json({ 
      success: true,
      message: "Report sent to your email successfully!",
      sentTo: user.email 
    });

  } catch (error) {
    console.error("❌ Email sending error:", error);
    res.status(500).json({ message: "Failed to send email. Please try again." });
  }
});

export default router;
