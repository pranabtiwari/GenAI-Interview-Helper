import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

await transporter.sendMail({
  from: process.env.EMAIL,
  to: user.email,
  subject: "Password Reset",
  html: `
    <h2>Reset Password</h2>
    <a href="${resetLink}">Click here</a>
  `
});