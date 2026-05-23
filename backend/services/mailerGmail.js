import nodemailer from "nodemailer";
import "dotenv/config"


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendResetPasswordMail(to, resetLink) {
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL and EMAIL_PASS must be set");
  }

  return transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Password Reset",
    html: `
      <h2>Reset Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });
}

export default sendResetPasswordMail;